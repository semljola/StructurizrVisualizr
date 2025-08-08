// Test DSL parsing functionality
const fs = require('fs');

// Simple DSL parser test
function testDSLParsing() {
  console.log('Testing DSL parsing...\n');
  
  // Read the FlygTaxi DSL
  const dslContent = fs.readFileSync('c4model.dsl', 'utf8');
  
  // Simple regex-based parsing for testing
  const workspaceMatch = dslContent.match(/workspace\s+"([^"]+)"/);
  const workspaceName = workspaceMatch ? workspaceMatch[1] : 'Unknown';
  
  // Count elements
  const personCount = (dslContent.match(/person\s+"/g) || []).length;
  const systemCount = (dslContent.match(/softwareSystem\s+"/g) || []).length;
  const containerCount = (dslContent.match(/container\s+"/g) || []).length;
  const relationshipCount = (dslContent.match(/->/g) || []).length;
  
  console.log(`Workspace: ${workspaceName}`);
  console.log(`People: ${personCount}`);
  console.log(`Systems: ${systemCount}`);
  console.log(`Containers: ${containerCount}`);
  console.log(`Relationships: ${relationshipCount}`);
  
  // Extract some sample elements
  const personMatches = dslContent.match(/(\w+)\s*=\s*person\s+"([^"]+)"/g);
  const systemMatches = dslContent.match(/(\w+)\s*=\s*softwareSystem\s+"([^"]+)"/g);
  
  console.log('\nSample People:');
  personMatches?.slice(0, 3).forEach(match => {
    const nameMatch = match.match(/(\w+)\s*=\s*person\s+"([^"]+)"/);
    if (nameMatch) {
      console.log(`- ${nameMatch[1]}: ${nameMatch[2]}`);
    }
  });
  
  console.log('\nSample Systems:');
  systemMatches?.slice(0, 3).forEach(match => {
    const nameMatch = match.match(/(\w+)\s*=\s*softwareSystem\s+"([^"]+)"/);
    if (nameMatch) {
      console.log(`- ${nameMatch[1]}: ${nameMatch[2]}`);
    }
  });
  
  // Test if the DSL has the expected structure
  const hasModel = dslContent.includes('model {');
  const hasViews = dslContent.includes('views {');
  const hasWorkspace = dslContent.includes('workspace');
  
  console.log('\nDSL Structure:');
  console.log(`- Has workspace: ${hasWorkspace ? '✅' : '❌'}`);
  console.log(`- Has model: ${hasModel ? '✅' : '❌'}`);
  console.log(`- Has views: ${hasViews ? '✅' : '❌'}`);
  
  if (hasWorkspace && hasModel && hasViews) {
    console.log('\n✅ DSL structure looks correct!');
    console.log('The issue might be in the React components or React Flow setup.');
  } else {
    console.log('\n❌ DSL structure has issues!');
  }
}

testDSLParsing();
