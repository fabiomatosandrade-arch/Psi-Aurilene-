
import { jsPDF } from 'jspdf';
import { DailyEntry, User, Mood } from '../types';
// Fixed: Importing getAppLogo instead of non-existent LOGO_AS_GOLD
import { getAppLogo } from '../constants';

const moodToLabel = (mood: Mood) => {
  switch (mood) {
    case Mood.VERY_BAD: return 'Muito Mal';
    case Mood.BAD: return 'Mal';
    case Mood.NEUTRAL: return 'Neutro';
    case Mood.GOOD: return 'Bem';
    case Mood.EXCELLENT: return 'Muito Bem';
    default: return '';
  }
};

export const generateReportPDF = (user: User, entries: DailyEntry[]) => {
  const doc = new jsPDF();
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  // Logo e Título
  try {
    // Fixed: Using getAppLogo() which correctly retrieves the current branding (custom or default)
    doc.addImage(getAppLogo(), 'PNG', 85, 10, 40, 40); 
  } catch(e) {
    // Fallback se a imagem falhar
    doc.setFontSize(30);
    doc.setTextColor(184, 134, 11);
    doc.text('AS', 105, 30, { align: 'center' });
  }

  doc.setFontSize(16);
  doc.setTextColor(50, 50, 50);
  doc.text('Relatório Terapêutico Individual', 105, 55, { align: 'center' });

  // Info Paciente
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Paciente: ${user.fullName}`, 20, 70);
  doc.text(`CPF: ${user.cpf}`, 20, 76);
  doc.text(`Período: ${new Date(sortedEntries[sortedEntries.length-1].date).toLocaleDateString()} a ${new Date(sortedEntries[0].date).toLocaleDateString()}`, 20, 82);

  doc.setDrawColor(212, 175, 55);
  doc.line(20, 88, 190, 88);

  // Registros
  let y = 100;
  sortedEntries.forEach((entry) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(184, 134, 11);
    doc.text(new Date(entry.date).toLocaleDateString('pt-BR'), 20, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Humor: ${moodToLabel(entry.mood)}`, 150, y);

    y += 6;
    const notes = doc.splitTextToSize(entry.notes, 170);
    doc.text(notes, 20, y);
    
    y += (notes.length * 5) + 12;
    doc.setDrawColor(240, 240, 240);
    doc.line(20, y-6, 190, y-6);
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Documento confidencial para fins terapêuticos. Gerado via App Psi.Aurilene.', 105, 285, { align: 'center' });
  }

  return doc;
};
