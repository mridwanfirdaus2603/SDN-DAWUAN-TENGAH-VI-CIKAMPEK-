import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Dynamic routing configuration
export const dynamic = "force-dynamic";

// Helper to initialize Gemini Client with standard headers for telemetry
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured in Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Node types supported in the front-end network visualizer
const NODE_COLORS = {
  origin: "#ec4899", // Pink
  synapse: "#06b6d4", // Cyan
  transmitter: "#10b981", // Emerald
  receptor: "#eab308", // Yellow
  inhibitor: "#f43f5e", // Rose
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required ('generate' or 'expand')" },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();

    if (action === "generate") {
      const { topic } = body;
      if (!topic || typeof topic !== "string") {
        return NextResponse.json(
          { error: "Topic is required for generate action" },
          { status: 400 }
        );
      }

      const systemInstruction = `You are an advanced neuroscience-inspired conceptual mapping model called Neural System Gemini.
Your goal is to parse a semantic topic and model it as a high-fidelity conceptual "neural network" containing neurons (nodes) and synaptic links (connections).

Rules for modeling:
1. Represent the core concept as the root "origin" node.
2. Structure 5 to 7 other related conceptual nodes representing the neurological, logical, or semantic core aspects of the topic.
3. Assign each node an appropriate type matching the concept: "origin", "synapse" (core ideas), "transmitter" (mediating factors), "receptor" (receptive/impact factors), or "inhibitor" (constraining factors).
4. Assign a relative weight "val" value to each node indicating its prominence or visual weight (range 8 to 22).
5. Connections (links) should show how these concepts fire and activate each other, with a "label" explaining the transmission and a "strength" from 0.1 to 1.0.
6. Return a comprehensive "overview" detailing the cognitive interpretation of this map in a short, high-level scientific summary.`;

      const prompt = `Map the neural architecture of the topic: "${topic}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nodes: {
                type: Type.ARRAY,
                description: "List of neuronal concepts mapped for the topic.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "Uniquely incremental ID starting from '1'." },
                    label: { type: Type.STRING, description: "Concise human-readable label of the concept neuron." },
                    type: { type: Type.STRING, description: "The conceptual category of the neuron." },
                    val: { type: Type.NUMBER, description: "Influence weight from 8 to 22." },
                    details: { type: Type.STRING, description: "A high-fidelity conceptual description of this specific node." },
                    color: { type: Type.STRING, description: "The color associated with node type (must be hex string matching node categories)." }
                  },
                  required: ["id", "label", "type", "val", "details", "color"]
                }
              },
              links: {
                type: Type.ARRAY,
                description: "Bridges/synaptic connections linking different neurons.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING, description: "The source node ID." },
                    target: { type: Type.STRING, description: "The target node ID." },
                    label: { type: Type.STRING, description: "The relationship/synaptic process label." },
                    strength: { type: Type.NUMBER, description: "Synaptic weight strength from 0.1 to 1.0." }
                  },
                  required: ["source", "target", "label", "strength"]
                }
              },
              overview: {
                type: Type.STRING,
                description: "A short, immersive scientific and poetic neurological abstract summarizing how Gemini models this mental domain."
              }
            },
            required: ["nodes", "links", "overview"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Zero-content returned from Neural System model.");
      }

      const parsed = JSON.parse(responseText.trim());
      return NextResponse.json(parsed);
    } 

    if (action === "expand") {
      const { nodeId, nodeLabel, topic, existingNodeIds } = body;
      if (!nodeId || !nodeLabel || !topic) {
        return NextResponse.json(
          { error: "Missing required parameters for node expansion" },
          { status: 400 }
        );
      }

      const systemInstruction = `You are the Neural System Gemini conceptual expanding engine. 
A user has selected a specific conceptual neuron: "${nodeLabel}" (ID: ${nodeId}) within the context of "${topic}".

Your goal is to generate 3 new deep sub-neurons branching directly from this origin neuron, representing a deep neurological sub-level or creative synapse breakthrough of this specific subtopic.
Assign them unique local IDs and define links that connect them directly to the parent neuron "${nodeId}".
The node types must be: "synapse", "transmitter", "receptor", or "inhibitor". Assign them appropriate colors and relative weights between 8 and 18.`;

      const prompt = `Produce 3 new synaptic branch neurons representing deep cognitive layers originating directly and exclusively from "${nodeLabel}" (ID: ${nodeId}).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "New unique incremental branch ID, e.g. '101', '102', '103'." },
                    label: { type: Type.STRING, description: "Scientific or distinct concept label." },
                    type: { type: Type.STRING },
                    val: { type: Type.NUMBER },
                    details: { type: Type.STRING, description: "Deep conceptual sub-details." },
                    color: { type: Type.STRING }
                  },
                  required: ["id", "label", "type", "val", "details", "color"]
                }
              },
              links: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING, description: "Must be the parent ID: '" + nodeId + "'." },
                    target: { type: Type.STRING, description: "Must be the newly generated branch node's ID." },
                    label: { type: Type.STRING, description: "Synaptic firing description." },
                    strength: { type: Type.NUMBER }
                  },
                  required: ["source", "target", "label", "strength"]
                }
              }
            },
            required: ["nodes", "links"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Zero-content returned from expansion model.");
      }

      const parsed = JSON.parse(responseText.trim());

      // Ensure absolutely unique IDs that do not collide with existing client-side nodes
      const existingSet = new Set(existingNodeIds || []);
      const suffix = Math.floor(Math.random() * 1000);

      const resolvedNodes = parsed.nodes.map((node: any, idx: number) => {
        let newId = node.id;
        // If ID collides or is simple, transform it
        if (existingSet.has(newId) || newId.length < 3) {
          newId = `n-${nodeId}-${suffix}-${idx}`;
        }
        return { ...node, id: newId };
      });

      const resolvedLinks = parsed.links.map((link: any, idx: number) => {
        let targetId = link.target;
        // The corresponding node at idx will have the transformed ID
        const matchingNode = parsed.nodes[idx];
        if (matchingNode) {
          targetId = resolvedNodes[idx].id;
        }
        return {
          ...link,
          source: String(nodeId), // ensure starts at parent
          target: targetId,
        };
      });

      return NextResponse.json({
        nodes: resolvedNodes,
        links: resolvedLinks,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred inside the Gemini Neural engine." },
      { status: 500 }
    );
  }
}
