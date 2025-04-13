import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import {
  Activity,
  HeartPulse,
  Gauge,
  Thermometer,
  Stethoscope,
  MessageSquare,
  Image as ImageIcon,
  Upload,
  Search,
  ClipboardList,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  BookOpen,
  FileText,
  Bot,
  ScanEye,
  Pulse
} from "lucide-react";

export const TaskAssistant = () => {
  const [healthForm, setHealthForm] = useState({
    heart_rate: "",
    bp: "",
    oxygen_saturation: "",
    symptoms: "",
    feedback: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [question, setQuestion] = useState("What clinical findings are visible in this image?");
  const [imageResponse, setImageResponse] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [isImageProcessing, setIsImageProcessing] = useState(false);

  const [healthResponse, setHealthResponse] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState(null);
  const [activeTab, setActiveTab] = useState("image");
  const [expandedSection, setExpandedSection] = useState(null);

  const handleHealthChange = (e) => {
    const { name, value } = e.target;
    setHealthForm({ ...healthForm, [name]: value });
  };

  const handleHealthSubmit = async (e) => {
    e.preventDefault();
    setHealthLoading(true);
    setHealthError(null);
    setHealthResponse(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_GEN_AI_ENDPOINT}/image-reader`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(healthForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate recovery plan");
      }

      setHealthResponse(data);
    } catch (err) {
      setHealthError(err.message);
    } finally {
      setHealthLoading(false);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setImageError("Please select an image file");
      return;
    }

    setIsImageProcessing(true);
    setImageError(null);
    setImageResponse(null);

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("question", question);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_GEN_AI_ENDPOINT}/recovery-routine-api`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to process image");
      }

      setImageResponse(data);
    } catch (err) {
      setImageError(err.message);
    } finally {
      setIsImageProcessing(false);
    }
  };

  useEffect(() => {
    if (healthResponse?.score) {
      drawChart(healthResponse.score);
    }
  }, [healthResponse]);

  const drawChart = (score) => {
    d3.select("#chart").selectAll("*").remove();
    
    const width = 160;
    const height = 160;
    const radius = Math.min(width, height) / 2;
    
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    const arc = d3.arc()
      .innerRadius(radius * 0.75)
      .outerRadius(radius * 0.95)
      .cornerRadius(4);
    
    const pie = d3.pie()
      .sort(null)
      .value(d => d.value);
    
    const data = [{value: score}, {value: 100 - score}];
    const color = d3.scaleOrdinal()
      .range(["#3b82f6", "#e5e7eb"]);

    svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.index))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("font-size", "22px")
      .style("font-weight", "600")
      .style("fill", "#1d4ed8")
      .text(`${score}%`);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 w-full">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 mb-4">
            <Stethoscope className="text-blue-600 dark:text-blue-400" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Clinical Analysis Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Advanced tool for medical metric evaluation and diagnostic image interpretation
          </p>
        </header>

        <div className="flex mb-8 border-b border-gray-200 dark:border-gray-800">
          <button
            className={`flex items-center gap-2 py-3 px-6 font-medium transition-all ${activeTab === 'health' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('health')}
          >
            <HeartPulse size={18} className="shrink-0" />
            <span>Health Assessment</span>
          </button>
          <button
            className={`flex items-center gap-2 py-3 px-6 font-medium transition-all ${activeTab === 'image' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('image')}
          >
            <ScanEye size={18} className="shrink-0" />
            <span>Image Analysis</span>
          </button>
        </div>

        {activeTab === 'health' && (
          <div className="gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <ClipboardList className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <h2 className="text-xl font-semibold">Patient Metrics</h2>
                </div>
                <form onSubmit={handleHealthSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-2">
                        <HeartPulse size={16} className="text-rose-600" />
                        Heart Rate (bpm)
                      </span>
                    </label>
                    <input
                      type="number"
                      name="heart_rate"
                      value={healthForm.heart_rate}
                      onChange={handleHealthChange}
                      required
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="72"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-2">
                        <Gauge size={16} className="text-blue-500" />
                        Blood Pressure (mmHg)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="bp"
                      value={healthForm.bp}
                      onChange={handleHealthChange}
                      required
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="120/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-2">
                        <Thermometer size={16} className="text-amber-500" />
                        Oxygen Saturation (%)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="oxygen_saturation"
                      value={healthForm.oxygen_saturation}
                      onChange={handleHealthChange}
                      required
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="98%"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-purple-500" />
                        Symptoms
                      </span>
                    </label>
                    <input
                      type="text"
                      name="symptoms"
                      value={healthForm.symptoms}
                      onChange={handleHealthChange}
                      required
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Fever, cough, headache"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-cyan-500" />
                        Clinical Notes
                      </span>
                    </label>
                    <textarea
                      name="feedback"
                      rows="3"
                      value={healthForm.feedback}
                      onChange={handleHealthChange}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Patient history or observations..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={healthLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {healthLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Activity size={18} />
                        <span>Generate Assessment</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              {healthError && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <XCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <h3 className="font-medium text-red-800 dark:text-red-200">Analysis Error</h3>
                    <p className="text-red-600 dark:text-red-300 text-sm">{healthError}</p>
                  </div>
                </div>
              )}

              {healthResponse && (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">f
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold flex items-center gap-3">
                          <ClipboardCheck size={20} className="text-blue-200" />
                          <span>Patient Recovery Assessment</span>
                        </h2>
                        <p className="text-blue-100 mt-1 text-sm">Comprehensive clinical evaluation</p>
                      </div>
                      <div id="chart" className="flex-shrink-0"></div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div 
                      className="cursor-pointer flex items-center justify-between py-3"
                      onClick={() => toggleSection('plan')}
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                        <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />
                        <span>Treatment Protocol</span>
                      </h3>
                      {expandedSection === 'plan' ? (
                        <ChevronDown className="text-gray-500" />
                      ) : (
                        <ChevronRight className="text-gray-500" />
                      )}
                    </div>

                    {expandedSection === 'plan' && (
                      <div className="mt-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        {healthResponse.plan.split('\n').map((line, i) => (
                          <p key={i} className="mb-3 last:mb-0 text-gray-700 dark:text-gray-300">{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className=" gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <ImageIcon className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <h2 className="text-xl font-semibold">Diagnostic Imaging</h2>
                </div>
                <form onSubmit={handleImageSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-2">
                        <Upload size={16} className="text-blue-500" />
                        Medical Image
                      </span>
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                          {imageFile ? (
                            <>
                              <CheckCircle className="text-green-500 mb-2" size={28} />
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {imageFile.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Click to change file
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="text-gray-400 mb-2" size={28} />
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Upload DICOM/JPEG/PNG</span>
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Supports X-rays, CT scans, MRI, etc.
                              </p>
                            </>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*,.dcm"
                          onChange={(e) => setImageFile(e.target.files[0])}
                          required
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-2">
                        <Search size={16} className="text-purple-500" />
                        Clinical Query
                      </span>
                    </label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      rows="2"
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="What would you like to know about this image?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isImageProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {isImageProcessing ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <ScanEye size={18} />
                        <span>Analyze Image</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              {imageError && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <XCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <h3 className="font-medium text-red-800 dark:text-red-200">Processing Error</h3>
                    <p className="text-red-600 dark:text-red-300 text-sm">{imageError}</p>
                  </div>
                </div>
              )}

              {imageResponse && (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                    <h2 className="text-xl font-semibold flex items-center gap-3">
                      <Bot size={20} className="text-blue-200" />
                      <span>Radiological Findings</span>
                    </h2>
                    <p className="text-blue-100 mt-1 text-sm">AI-powered diagnostic interpretation</p>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-3 mb-4">
                        <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                        <span>Extracted Text</span>
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {imageResponse.extracted_text || "No text could be extracted from the image"}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-3 mb-4">
                        <Bot size={18} className="text-blue-600 dark:text-blue-400" />
                        <span>Clinical Interpretation</span>
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                        {imageResponse.answer_from_image_text || "No interpretation available"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};