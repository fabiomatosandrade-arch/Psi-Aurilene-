
import { GoogleGenAI } from "@google/genai";
import React, { useState } from 'react';
import Layout from '../components/Layout';

const LogoGen: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateLogo = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Prompt otimizado para o pedido específico: AS sobrepostos
      const prompt = "A high-end professional luxury logo for a clinic. The central element is a sophisticated monogram of the letters 'A' and 'S' elegantly overlaid and intertwined. Colors: Deep royal navy blue and metallic polished gold. Minimalist, clean white background, symmetrical, vector style, artistic and premium look.";
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            setGeneratedImage(`data:image/png;base64,${base64Data}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error("Não foi possível gerar a imagem. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao gerar a logo. Verifique sua conexão ou tente novamente em instantes.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyLogo = () => {
    if (generatedImage) {
      localStorage.setItem('psicolog_custom_logo', generatedImage);
      alert("Identidade visual atualizada com sucesso!");
      window.location.hash = '#dashboard';
    }
  };

  return (
    <Layout title="Personalizar Marca" onBack={() => window.location.hash = '#dashboard'}>
      <div className="space-y-8 text-center">
        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <i className="fas fa-wand-magic-sparkles text-xl text-blue-900"></i>
          </div>
          <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">Gerador de Logo AS</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">Criaremos um monograma exclusivo com as letras <span className="font-bold text-blue-900">A</span> e <span className="font-bold text-amber-600">S</span> sobrepostas.</p>
        </div>

        <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-50 flex items-center justify-center overflow-hidden group">
          {generatedImage ? (
            <img src={generatedImage} alt="Logo Gerada" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <i className="fas fa-palette text-5xl text-slate-100 mb-4"></i>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aguardando comando</p>
            </div>
          )}
          
          {isGenerating && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-50">
              <div className="w-12 h-12 border-4 border-blue-900 border-t-amber-400 rounded-full animate-spin mb-4 shadow-lg"></div>
              <p className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] animate-pulse">Desenhando seu monograma...</p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-[10px] font-bold p-4 rounded-2xl border border-red-100 uppercase tracking-wider mx-2">
            <i className="fas fa-exclamation-triangle mr-2"></i> {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 px-2">
          <button
            onClick={generateLogo}
            disabled={isGenerating}
            className="w-full brand-gradient text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-[0.2em] text-xs active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <i className={`fas ${generatedImage ? 'fa-redo-alt' : 'fa-sparkles'}`}></i>
            {generatedImage ? 'Gerar Outra Versão' : 'Criar Logo Profissional'}
          </button>

          {generatedImage && !isGenerating && (
            <button
              onClick={applyLogo}
              className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-[0.2em] text-xs active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <i className="fas fa-check-circle"></i>
              Aplicar esta Logo
            </button>
          )}
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl mx-2">
           <p className="text-[9px] text-slate-400 leading-relaxed italic">
            Dica: Se a logo não for exatamente como deseja, clique em "Gerar Outra Versão". A IA criará uma variação exclusiva a cada clique.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LogoGen;
