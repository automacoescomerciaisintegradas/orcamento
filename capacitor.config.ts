import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rqrpinturas.orcamento',
  appName: 'Criar Orçamento',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Live Reload para suportar Server Actions e rotas de API no emulador
    // Ajuste o IP abaixo para o seu IP local se necessário
    url: 'http://10.0.2.2:3000', 
    cleartext: true
  }
};

export default config;
