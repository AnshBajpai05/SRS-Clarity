import re
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from pipeline.utils import setup_logger

logger = setup_logger("stage5_intelligence")

# ────────────────────────────────────────────────────────────────────
# 1. ELITE SCHEMAS
# ────────────────────────────────────────────────────────────────────

class LogicBlock(BaseModel):
    type: str = "conditional"
    trigger: Optional[Dict[str, Any]] = None
    condition: Optional[str] = None
    action: Optional[Dict[str, Any]] = None
    result: Optional[str] = None
    confidence: float = 1.0

class ACNode(BaseModel):
    text: str
    type: str = "requirement" # group, condition, action, requirement
    level: int = 0
    children: List['ACNode'] = Field(default_factory=list)
    logic: List[LogicBlock] = Field(default_factory=list)

class UserStory(BaseModel):
    id: str
    role: str
    goal: str
    reason: Optional[str] = None
    confidence: float = 0.0
    acceptance_criteria: List[ACNode] = Field(default_factory=list)
    raw_text: str

class RequirementsModel(BaseModel):
    document_name: str
    actors: List[str]
    user_stories: List[UserStory]
    metadata: Dict[str, Any] = Field(default_factory=dict)

# ────────────────────────────────────────────────────────────────────
# 2. ACTOR NORMALIZATION
# ────────────────────────────────────────────────────────────────────

ACTOR_MAP = {
    "CR": "Class Representative",
    "Class Representative": "Class Representative",
    "Faculty member": "Faculty",
    "Faculty": "Faculty",
    "Admin": "Admin",
    "Administrator": "Admin"
}

def normalize_actor(raw_role: str) -> str:
    raw_role = raw_role.strip().strip('*').strip()
    for pattern, canonical in ACTOR_MAP.items():
        if pattern.lower() in raw_role.lower():
            return canonical
    return raw_role

# ────────────────────────────────────────────────────────────────────
# 3. SEMANTIC PARSING
# ────────────────────────────────────────────────────────────────────

def extract_logic(text: str) -> List[LogicBlock]:
    """Attempts to extract structured logic from AC text."""
    logic_list = []
    
    # Pattern: If [Condition], [Result/Action]
    # Handle both "If X THEN Y" (normalized symbol) and "If X, Y"
    if_then_pattern = re.compile(r"If\s+(?P<cond>.*?)(?:,\s*| THEN\s+)(?P<res>.*?)(?:\.|$)", re.IGNORECASE)
    
    for match in if_then_pattern.finditer(text):
        cond = match.group("cond").strip()
        res = match.group("res").strip()
        
        # Simple heuristic for trigger/action
        logic_list.append(LogicBlock(
            type="conditional",
            trigger={"event": "status_change", "value": cond},
            condition=cond,
            action={"type": "outcome", "description": res},
            confidence=0.85
        ))
        
    return logic_list

def parse_ac_tree(lines: List[str]) -> List[ACNode]:
    """Recursively parses bullet points into a hierarchical tree."""
    if not lines:
        return []
        
    root_nodes = []
    stack = [] # (indent, node)
    
    for line in lines:
        # Detect indentation and bullet type
        match = re.match(r"^(\s*)([-*•]|\d+\.)\s+(.*)", line)
        if not match:
            continue
            
        indent_str, bullet, content = match.groups()
        indent = len(indent_str)
        content = content.replace("**", "").strip()
        
        node = ACNode(
            text=content,
            type="group" if content.endswith(":") else "requirement",
            level=indent,
            logic=extract_logic(content)
        )
        
        # Adjust stack to find parent
        while stack and stack[-1][0] >= indent:
            stack.pop()
            
        if not stack:
            root_nodes.append(node)
        else:
            stack[-1][1].children.append(node)
            
        stack.append((indent, node))
        
    return root_nodes

def parse_user_story(block: str, us_id: str) -> Optional[UserStory]:
    """Parses a raw block of text into a structured User Story."""
    # Elite Hardening: Strip out bolding artifacts before parsing semantic structure
    clean_body = block.replace("**", "")
    lines = clean_body.split('\n')
    
    # Improved patterns with optional styling and multi-line support
    role_pattern = re.compile(r"As a\s+(?P<role>.*?)(?:,|\s+I want to)", re.IGNORECASE | re.DOTALL)
    goal_pattern = re.compile(r"I want to\s+(?P<goal>.*?)(?:,|\s+so that|$)", re.IGNORECASE | re.DOTALL)
    benefit_pattern = re.compile(r"so that\s+(?P<reason>.*?)(?:\.|\n|$|####)", re.IGNORECASE | re.DOTALL)
    
    role_match = role_pattern.search(clean_body)
    goal_match = goal_pattern.search(clean_body)
    benefit_match = benefit_pattern.search(clean_body)
    
    if not (role_match and goal_match):
        logger.debug(f"Block content for {us_id}: {clean_body[:100]}...")
        return None
        
    role = normalize_actor(role_match.group("role").strip())
    goal = goal_match.group("goal").strip().replace("\n", " ")
    reason = benefit_match.group("reason").strip().replace("\n", " ") if benefit_match else None
    
    # Extract Acceptance Criteria
    ac_lines = []
    in_ac = False
    for line in lines:
        if "Acceptance Criteria" in line:
            in_ac = True
            continue
        if in_ac:
            ac_lines.append(line)
            
    ac_tree = parse_ac_tree(ac_lines)
    
    confidence = 0.95 if reason else 0.75
    
    return UserStory(
        id=us_id,
        role=role,
        goal=goal,
        reason=reason,
        confidence=confidence,
        acceptance_criteria=ac_tree,
        raw_text=block
    )

# ────────────────────────────────────────────────────────────────────
# 4. MAIN STAGE FUNCTION
# ────────────────────────────────────────────────────────────────────

def run_stage5_intelligence(md_path: Path, output_dir: Path) -> Path:
    """
    Elite Intelligence Layer: Transforms Markdown into structured Reasoning Model.
    """
    logger.info(f"Starting Stage 5 Intelligence on {md_path.name}")
    
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    doc_name = md_path.stem.replace("_clean", "")
    
    # Improved splitting that handles various header levels and bolding in headers
    us_blocks = re.split(r"(?=\n#+ \**US\d+)", content)
    
    user_stories = []
    actors = set()
    
    for block in us_blocks:
        block = block.strip()
        if not block: continue
        
        # Identify Story ID (e.g. US001)
        id_match = re.search(r"US(\d+)", block)
        if not id_match: 
            continue
            
        us_id = f"US{id_match.group(1)}"
        logger.debug(f"Found block for {us_id}")
        
        try:
            us_obj = parse_user_story(block, us_id)
            if us_obj:
                user_stories.append(us_obj)
                actors.add(us_obj.role)
                logger.debug(f"Successfully extracted {us_id}")
            else:
                logger.warning(f"Failed to extract structure for {us_id}")
        except Exception as e:
            logger.error(f"Error processing {us_id}: {e}")
            
    # Assemble model
    model = RequirementsModel(
        document_name=doc_name,
        actors=sorted(list(actors)),
        user_stories=user_stories,
        metadata={
            "total_stories": len(user_stories),
            "source_file": str(md_path)
        }
    )
    
    # Save to disk
    out_path = output_dir / f"{doc_name}_intelligence.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(model.model_dump_json(indent=2))
        
    logger.info(f"Successfully exported intelligence model to {out_path}")
    return out_path
