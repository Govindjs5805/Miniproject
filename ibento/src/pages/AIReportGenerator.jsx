import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function AIReportGenerator({ eventData, feedbacks }) {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const feedbackText = feedbacks.map(f => `- ${f.comment} (Rating: ${f.rating}/5)`).join("\n");
      
      const prompt = `
        As a Faculty Coordinator, write a formal event report summary based on this data:
        Event Title: ${eventData.title}
        Description: ${eventData.description}
        Total Attendees: ${eventData.attendedCount}
        Student Feedback:
        ${feedbackText}
        
        Please include:
        1. An executive summary of the event's success.
        2. Analysis of student satisfaction based on feedback.
        3. A recommendation for future similar events.
        Keep it professional and academic.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setReport(response.text());
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-report-card" style={{ background: "#f0f7ff", padding: "20px", borderRadius: "12px", border: "1px solid #007bff" }}>
      <h3>✨ AI Executive Summary</h3>
      {report ? (
        <div className="report-text" style={{ whiteSpace: "pre-wrap", color: "#333", lineHeight: "1.6" }}>
          {report}
        </div>
      ) : (
        <p>No report generated yet. Click the button to analyze event success with AI.</p>
      )}
      
      <button 
        onClick={generateReport} 
        disabled={loading}
        style={{ marginTop: "15px", background: "#007bff", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}
      >
        {loading ? "AI is thinking..." : "Generate AI Report"}
      </button>
    </div>
  );
}