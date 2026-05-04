
```javascript
import Anthropic from "@anthropic-ai/sdk";
import readline from "readline";

const client = new Anthropic();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function generateBusinessIdeas(industry, budget, targetMarket) {
  const systemPrompt = `You are an expert business consultant specializing in startup ideas and validation. 
Your role is to generate innovative business ideas and validate them based on feasibility, market demand, and profitability.
When generating ideas, consider:
1. Market trends and gaps
2. Target audience pain points
3. Competitive landscape
4. Revenue potential
5. Implementation complexity

Format your response with clear sections for each idea including:
- Idea Name
- Description
- Target Market Analysis
- Revenue Model
- Startup Costs
- Feasibility Score (1-10)
- Validation Steps`;

  const userPrompt = `Generate 3 innovative business ideas for the ${industry} industry with a budget of $${budget} targeting ${targetMarket}.
For each idea, provide:
1. A catchy name
2. Detailed description
3. Why this market needs it
4. How to validate the idea
5. Estimated profitability (low/medium/high)
6. Key success factors`;

  console.log("\n🚀 Generating business ideas...\n");

  const stream = client.messages.stream({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  let fullResponse = "";

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      process.stdout.write(chunk.delta.text);
      fullResponse += chunk.delta.text;
    }
  }

  return fullResponse;
}

async function validateIdea(ideaDescription) {
  const systemPrompt = `You are a business validation expert. Your job is to critically evaluate business ideas.
Provide a structured validation report that includes:
1. Market Validation
2. Technical Feasibility
3. Financial Viability
4. Competitive Analysis
5. Risk Assessment
6. Go/No-Go Recommendation
7. Next Steps for Validation`;

  const userPrompt = `Please validate this business idea:

${ideaDescription}

Provide a detailed validation report with specific metrics and recommendations.`;

  console.log("\n📊 Validating idea...\n");

  const stream = client.messages.stream({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  let fullResponse = "";

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      process.stdout.write(chunk.delta.text);
      fullResponse += chunk.delta.text;
    }
  }

  return fullResponse;
}

async function createActionPlan(idea) {
  const systemPrompt = `You are a business implementation expert. Create detailed, actionable plans for launching startups.
Your plans should be:
1. Step-by-step and chronological
2. Include specific milestones
3. Identify key resources needed
4. Set realistic timelines
5. Include success metrics`;

  const userPrompt = `Create a detailed 90-day action plan to launch this business idea:

${idea}

Include:
- Week-by-week breakdown
- Key milestones
- Resource requirements
- Budget allocation
- Success metrics`;

  console.log("\n📋 Creating action plan...\n");

  const stream = client.messages.stream({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  let fullResponse = "";

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      process.stdout.write(chunk.delta.text);
      fullResponse += chunk.delta.text;
    }
  }

  return fullResponse;
}

async function main() {
  console.log("================================");
  console.log("🎯 Business Ideas Generator & Validator");
  console.log("================================\n");

  const industry = await question(
    "What industry are you interested in? (e.g., Tech, Healthcare, Finance): "
  );
  const budget = await question("What is your startup budget in USD? (e.g., 50000): ");
  const targetMarket = await question(
    "Who is your target market? (e.g., Small businesses, Millennials, Enterprises): "
  );

  // Generate ideas
  const ideas = await generateBusinessIdeas(industry, budget, targetMarket);

  console.log("\n\n" + "=".repeat(50));
  console.log("Would you like to validate one of these ideas? (yes/no)");
  const validateChoice = await question("> ");

  if (
    validateChoice.toLowerCase() === "yes" ||
    validateChoice.toLowerCase() === "y"
  ) {
    const ideaToValidate = await question(
      "Paste a brief description of the idea to validate: "
    );
    await validateIdea(ideaToValidate);

    console.log("\n\n" + "=".repeat(50));
    const createPlanChoice = await question(
      "Would