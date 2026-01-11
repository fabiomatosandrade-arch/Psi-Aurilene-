
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { GoogleGenAI } from "@google/genai";

const LogoGen: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateLogo = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = "A luxury minimalist professional logo for a psychologist. The logo features the letters 'AS' intertwined and overlaid on each other. Elegant deep navy blue and metallic gold color palette. Professional, high-end, clean white background, symmetrical, artistic and sophisticated design.";
      
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
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setGeneratedImage(`data:image/png;base64,${base64Data}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error("Não foi possível extrair a imagem da resposta.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao gerar logo. Verifique sua conexão ou tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyLogo = () => {
    if (generatedImage) {
      localStorage.setItem('psicolog_custom_logo', generatedImage);
      alert("Logo aplicada com sucesso em todo o sistema!");
      window.location.hash = '#dashboard';
    }
  };

  return (
    <Layout title="Personalizar Marca" onBack={() => window.location.hash = '#dashboard'}>
      <div className="space-y-8 text-center">
        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
          <i className="fas fa-magic text-3xl text-blue-900 mb-4"></i>
          <h2 className="text-xl font-black text-blue-900 uppercase">Gerador de Identidade</h2>
          <p className="text-xs text-slate-500 mt-2">Crie uma logo exclusiva com as letras <span className="font-bold">AS</span> sobrepostas em Azul e Dourado.</p>
        </div>

        <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-50 flex items-center justify-center overflow-hidden group">
          {generatedImage ? (
            <img src={generatedImage} alt="Logo Gerada" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <i className="fas fa-palette text-5xl text-slate-100 mb-4"></i>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Clique abaixo para criar</p>
            </div>
          )}
          
          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 border-4 border-blue-900 border-t-amber-400 rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest animate-pulse">Desenhando sua nova marca...</p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-[10px] font-bold p-4 rounded-2xl border border-red-100 uppercase">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 px-2">
          <button
            onClick={generateLogo}
            disabled={isGenerating}
            className="w-full brand-gradient text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-[0.2em] text-xs active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <i className="fas fa-sync-alt"></i>
            {generatedImage ? 'Gerar Outra Opção' : 'Gerar Logo Profissional'}
          </button>

          {generatedImage && (
            <button
              onClick={applyLogo}
              className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-[0.2em] text-xs active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <i className="fas fa-check-circle"></i>
              Usar esta logo no App
            </button>
          )}
        </div>

        <p className="text-[9px] text-slate-400 px-6 leading-relaxed italic">
          * A logo será gerada com IA em alta resolução. Caso goste do resultado, ela passará a ser exibida em todas as páginas do seu portal.
        </p>
      </div>
    </Layout>
  );
};

export default LogoGen;
