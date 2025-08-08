#!/usr/bin/env python3
"""
C4 Model DSL Validator

This script validates C4 model DSL files against the Structurizr DSL specification.
It checks for syntax errors, structural issues, and common problems.
"""

import re
import sys
from typing import List, Dict, Tuple, Set
from dataclasses import dataclass
from enum import Enum

class ValidationLevel(Enum):
    ERROR = "ERROR"
    WARNING = "WARNING"
    INFO = "INFO"

@dataclass
class ValidationIssue:
    level: ValidationLevel
    line: int
    message: str
    context: str = ""

class C4DSLValidator:
    def __init__(self):
        self.issues: List[ValidationIssue] = []
        self.lines: List[str] = []
        self.current_line = 0
        self.workspace_name = ""
        self.model_section = False
        self.views_section = False
        self.defined_elements: Set[str] = set()
        self.defined_relationships: Set[str] = set()
        
    def validate_file(self, file_path: str) -> List[ValidationIssue]:
        """Validate a C4 model DSL file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                self.lines = f.readlines()
        except FileNotFoundError:
            self.issues.append(ValidationIssue(
                ValidationLevel.ERROR, 0, f"File not found: {file_path}"
            ))
            return self.issues
        except Exception as e:
            self.issues.append(ValidationIssue(
                ValidationLevel.ERROR, 0, f"Error reading file: {str(e)}"
            ))
            return self.issues
            
        self.issues.clear()
        self.defined_elements.clear()
        self.defined_relationships.clear()
        
        # Validate overall structure
        self._validate_structure()
        
        # Validate each line
        for i, line in enumerate(self.lines, 1):
            self.current_line = i
            self._validate_line(line.strip())
            
        # Post-validation checks
        self._validate_references()
        
        return self.issues
    
    def _validate_structure(self):
        """Validate the overall structure of the DSL file."""
        content = '\n'.join(self.lines)
        
        # Check for workspace declaration
        if not re.search(r'workspace\s+"[^"]+"\s*{', content):
            self.issues.append(ValidationIssue(
                ValidationLevel.ERROR, 1, "Missing workspace declaration"
            ))
        
        # Check for model section
        if not re.search(r'model\s*{', content):
            self.issues.append(ValidationIssue(
                ValidationLevel.ERROR, 1, "Missing model section"
            ))
        
        # Check for views section
        if not re.search(r'views\s*{', content):
            self.issues.append(ValidationIssue(
                ValidationLevel.WARNING, 1, "Missing views section (recommended for visualization)"
            ))
        
        # Check for balanced braces
        open_braces = content.count('{')
        close_braces = content.count('}')
        if open_braces != close_braces:
            self.issues.append(ValidationIssue(
                ValidationLevel.ERROR, 1, f"Unbalanced braces: {open_braces} opening, {close_braces} closing"
            ))
    
    def _validate_line(self, line: str):
        """Validate a single line of DSL code."""
        if not line or line.startswith('#'):
            return
            
        # Track sections
        if line.strip() == 'model {':
            self.model_section = True
            self.views_section = False
        elif line.strip() == 'views {':
            self.model_section = False
            self.views_section = True
        elif line.strip() == '}':
            if self.model_section:
                self.model_section = False
            elif self.views_section:
                self.views_section = False
        
        # Validate workspace declaration
        if line.startswith('workspace'):
            self._validate_workspace_declaration(line)
        
        # Validate person declarations
        elif 'person' in line and '=' in line and self.model_section:
            self._validate_person_declaration(line)
        
        # Validate software system declarations
        elif 'softwareSystem' in line and '=' in line and self.model_section:
            self._validate_software_system_declaration(line)
        
        # Validate container declarations
        elif 'container' in line and '=' in line and self.model_section:
            self._validate_container_declaration(line)
        
        # Validate relationships
        elif '->' in line and self.model_section:
            self._validate_relationship(line)
        
        # Validate view declarations
        elif self.views_section and any(keyword in line for keyword in ['systemContext', 'container', 'component']):
            self._validate_view_declaration(line)
        
        # Validate styles
        elif self.views_section and line.strip().startswith('styles'):
            self._validate_styles_declaration(line)
    
    def _validate_workspace_declaration(self, line: str):
        """Validate workspace declaration syntax."""
        pattern = r'workspace\s+"([^"]+)"\s*{'
        match = re.match(pattern, line)
        if not match:
            self.issues.append(ValidationIssue(
                ValidationLevel.ERROR, self.current_line,
                "Invalid workspace declaration syntax. Expected: workspace \"name\" {",
                line
            ))
        else:
            self.workspace_name = match.group(1)
    
    def _validate_person_declaration(self, line: str):
        """Validate person declaration syntax."""
        pattern = r'(\w+)\s*=\s*person\s+"([^"]+)"(?:\s+"([^"]*)")?'
        match = re.match(pattern, line)
        if not match:
            self.issues.append(ValidationIssue(
                ValidationLevel.ERROR, self.current_line,
                "Invalid person declaration syntax. Expected: name = person \"description\" [\"technology\"]",
                line
            ))
        else:
            element_name = match.group(1)
            self.defined_elements.add(element_name)
    
    def _validate_software_system_declaration(self, line: str):
        """Validate software system declaration syntax."""
        pattern = r'(\w+)\s*=\s*softwareSystem\s+"([^"]+)"(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?'
        match = re.match(pattern, line)
        if not match:
            self.issues.append(ValidationIssue(
                ValidationLevel.ERROR, self.current_line,
                "Invalid software system declaration syntax. Expected: name = softwareSystem \"description\" [\"technology\"] [\"tags\"]",
                line
            ))
        else:
            element_name = match.group(1)
            self.defined_elements.add(element_name)
    
    def _validate_container_declaration(self, line: str):
        """Validate container declaration syntax."""
        pattern = r'(\w+)\s*=\s*container\s+"([^"]+)"(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?'
        match = re.match(pattern, line)
        if not match:
            self.issues.append(ValidationIssue(
                ValidationLevel.ERROR, self.current_line,
                "Invalid container declaration syntax. Expected: name = container \"description\" [\"technology\"] [\"tags\"]",
                line
            ))
        else:
            element_name = match.group(1)
            self.defined_elements.add(element_name)
    
    def _validate_relationship(self, line: str):
        """Validate relationship syntax."""
        # Remove comments
        line = re.sub(r'#.*$', '', line)
        
        # Basic relationship pattern
        pattern = r'([\w.]+)\s*->\s*([\w.]+)(?:\s+"([^"]*)")?'
        match = re.match(pattern, line)
        if not match:
            self.issues.append(ValidationIssue(
                ValidationLevel.ERROR, self.current_line,
                "Invalid relationship syntax. Expected: source -> destination [\"description\"]",
                line
            ))
        else:
            source = match.group(1)
            destination = match.group(2)
            relationship_key = f"{source}->{destination}"
            self.defined_relationships.add(relationship_key)
            
            # Check if source and destination elements exist
            if source not in self.defined_elements and not self._is_external_system(source):
                self.issues.append(ValidationIssue(
                    ValidationLevel.WARNING, self.current_line,
                    f"Source element '{source}' not defined before use",
                    line
                ))
            
            if destination not in self.defined_elements and not self._is_external_system(destination):
                self.issues.append(ValidationIssue(
                    ValidationLevel.WARNING, self.current_line,
                    f"Destination element '{destination}' not defined before use",
                    line
                ))
    
    def _validate_view_declaration(self, line: str):
        """Validate view declaration syntax."""
        pattern = r'(systemContext|container|component)\s+(\w+)(?:\s+"([^"]*)")?'
        match = re.match(pattern, line)
        if not match:
            self.issues.append(ValidationIssue(
                ValidationLevel.ERROR, self.current_line,
                "Invalid view declaration syntax. Expected: viewType elementName [\"title\"]",
                line
            ))
    
    def _validate_styles_declaration(self, line: str):
        """Validate styles declaration syntax."""
        if line.strip() != 'styles {':
            self.issues.append(ValidationIssue(
                ValidationLevel.ERROR, self.current_line,
                "Invalid styles declaration syntax. Expected: styles {",
                line
            ))
    
    def _is_external_system(self, element_name: str) -> bool:
        """Check if an element name represents an external system."""
        # This is a simplified check - in practice, external systems should be explicitly defined
        return element_name.endswith('_external') or 'external' in element_name.lower()
    
    def _validate_references(self):
        """Validate that all referenced elements are defined."""
        # This would require more sophisticated parsing to track all references
        # For now, we'll do basic checks
        pass
    
    def print_report(self):
        """Print a formatted validation report."""
        if not self.issues:
            print("✅ C4 Model DSL validation passed!")
            return
        
        print(f"🔍 C4 Model DSL Validation Report for: {self.workspace_name}")
        print("=" * 60)
        
        errors = [issue for issue in self.issues if issue.level == ValidationLevel.ERROR]
        warnings = [issue for issue in self.issues if issue.level == ValidationLevel.WARNING]
        infos = [issue for issue in self.issues if issue.level == ValidationLevel.INFO]
        
        if errors:
            print(f"\n❌ ERRORS ({len(errors)}):")
            for issue in errors:
                print(f"  Line {issue.line}: {issue.message}")
                if issue.context:
                    print(f"    Context: {issue.context}")
        
        if warnings:
            print(f"\n⚠️  WARNINGS ({len(warnings)}):")
            for issue in warnings:
                print(f"  Line {issue.line}: {issue.message}")
                if issue.context:
                    print(f"    Context: {issue.context}")
        
        if infos:
            print(f"\nℹ️  INFO ({len(infos)}):")
            for issue in infos:
                print(f"  Line {issue.line}: {issue.message}")
                if issue.context:
                    print(f"    Context: {issue.context}")
        
        print(f"\n📊 Summary: {len(errors)} errors, {len(warnings)} warnings, {len(infos)} info messages")
        
        if errors:
            print("\n❌ Validation failed!")
            sys.exit(1)
        else:
            print("\n✅ Validation completed with warnings/info only.")

def main():
    """Main function to run the validator."""
    if len(sys.argv) != 2:
        print("Usage: python validate_c4_dsl.py <dsl_file>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    validator = C4DSLValidator()
    validator.validate_file(file_path)
    validator.print_report()

if __name__ == "__main__":
    main()
