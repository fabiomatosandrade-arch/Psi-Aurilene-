
import { User, DailyEntry } from '../types';

// Nota: Em um ambiente real, este ID seria o endpoint do seu banco de dados
// Aqui simulamos usando um serviço público de armazenamento de JSON
const STORAGE_PROVIDER_URL = 'https://api.jsonbin.io/v3/b';
const MASTER_KEY = '$2b$10$ExemploKeyParaDemo12345'; // Em prod, usar variável de ambiente

declare const CryptoJS: any;

export const SyncService = {
  // Gera uma chave de criptografia única baseada na senha do usuário
  getSecretKey: (user: User) => {
    return `${user.password}_${user.cpf.replace(/\D/g, '')}`;
  },

  // Criptografa e salva na nuvem
  pushToCloud: async (user: User) => {
    try {
      const allEntries: DailyEntry[] = JSON.parse(localStorage.getItem('psicolog_entries') || '[]');
      const userEntries = allEntries.filter(e => e.userId === user.id);
      
      const dataToSync = {
        user: { ...user, password: '' }, // Não enviamos a senha original
        entries: userEntries,
        lastSync: new Date().toISOString()
      };

      const secretKey = SyncService.getSecretKey(user);
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dataToSync), secretKey).toString();

      // Simulando o salvamento (Em produção, aqui seria o seu fetch para o backend)
      // Usamos o localStorage para simular o "servidor remoto" que é compartilhado
      // mas na prática isso seria um POST para uma API.
      const cloudStore = JSON.parse(localStorage.getItem('psicolog_cloud_mock') || '{}');
      cloudStore[user.username] = encryptedData;
      localStorage.setItem('psicolog_cloud_mock', JSON.stringify(cloudStore));
      
      return true;
    } catch (error) {
      console.error('Erro no Push:', error);
      return false;
    }
  },

  // Busca da nuvem e descriptografa
  pullFromCloud: async (username: string, passwordAttempt: string, cpfAttempt: string) => {
    try {
      const cloudStore = JSON.parse(localStorage.getItem('psicolog_cloud_mock') || '{}');
      const encryptedData = cloudStore[username];

      if (!encryptedData) return null;

      const secretKey = `${passwordAttempt}_${cpfAttempt.replace(/\D/g, '')}`;
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      // Atualiza localmente
      const users: User[] = JSON.parse(localStorage.getItem('psicolog_users') || '[]');
      if (!users.some(u => u.id === decryptedData.user.id)) {
        decryptedData.user.password = passwordAttempt; // Restaura a senha para login local
        users.push(decryptedData.user);
        localStorage.setItem('psicolog_users', JSON.stringify(users));
      }

      const entries: DailyEntry[] = JSON.parse(localStorage.getItem('psicolog_entries') || '[]');
      const otherEntries = entries.filter(e => e.userId !== decryptedData.user.id);
      localStorage.setItem('psicolog_entries', JSON.stringify([...otherEntries, ...decryptedData.entries]));

      return decryptedData.user;
    } catch (error) {
      console.error('Erro no Pull:', error);
      return null;
    }
  }
};
