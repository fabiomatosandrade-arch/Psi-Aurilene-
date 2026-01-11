import { jsPDF } from 'jspdf';
import { DailyEntry, User, Mood } from '../types';

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

  // Título Textual Elegante
  doc.setFontSize(24);
  doc.setTextColor(30, 58, 138); // Azul Marinho
  doc.setFont('helvetica', 'bold');
  doc.text('Psi. Aurilene Santiago', 105, 30, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(184, 134, 11); // Dourado
  doc.text('Relatório Terapêutico Individual', 105, 42, { align: 'center' });

  // Info Paciente
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`Paciente: ${user.fullName}`, 20, 60);
  doc.text(`CPF: ${user.cpf}`, 20, 66);
  doc.text(`Período: ${new Date(sortedEntries[sortedEntries.length-1].date).toLocaleDateString()} a ${new Date(sortedEntries[0].date).toLocaleDateString()}`, 20, 72);

  doc.setDrawColor(212, 175, 55);
  doc.line(20, 78, 190, 78);

  // Registros
  let y = 90;
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