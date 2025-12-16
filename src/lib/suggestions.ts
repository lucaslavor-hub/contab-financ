import { Carteira, Divida, Meta, Sugestao } from '@/types/financial';

interface EstadoFinanceiro {
  carteiras: Carteira[];
  dividas: Divida[];
  metas: Meta[];
}

export function gerarSugestoes(estado: EstadoFinanceiro): Sugestao[] {
  const sugestoes: Sugestao[] = [];
  
  // Encontrar meta de reserva de emergência
  const reservaEmergencia = estado.metas.find(m => m.ehReservaEmergencia);
  const dividasAtivas = estado.dividas.filter(d => d.status === 'ativa');
  const saldoTotal = estado.carteiras.reduce((sum, c) => sum + c.saldo, 0);
  
  // Sugestão: Reserva de emergência incompleta
  if (reservaEmergencia && reservaEmergencia.valorAcumulado < reservaEmergencia.valorAlvo) {
    const percentualConcluido = (reservaEmergencia.valorAcumulado / reservaEmergencia.valorAlvo) * 100;
    sugestoes.push({
      id: 'reserva-incompleta',
      tipo: 'aviso',
      titulo: 'Reserva de Emergência',
      mensagem: `Sua reserva está em ${percentualConcluido.toFixed(0)}%. Priorizar essa meta aumenta sua segurança financeira.`,
      ativa: true
    });
  }
  
  // Sugestão: Reserva completa
  if (reservaEmergencia && reservaEmergencia.valorAcumulado >= reservaEmergencia.valorAlvo) {
    sugestoes.push({
      id: 'reserva-completa',
      tipo: 'sucesso',
      titulo: 'Parabéns!',
      mensagem: 'Sua reserva de emergência está completa. Agora você pode focar em outros objetivos.',
      ativa: true
    });
  }
  
  // Sugestão: Dívidas ativas
  if (dividasAtivas.length > 0) {
    const totalDividas = dividasAtivas.reduce((sum, d) => sum + d.saldoRestante, 0);
    sugestoes.push({
      id: 'dividas-ativas',
      tipo: 'aviso',
      titulo: 'Dívidas Ativas',
      mensagem: `Você possui ${dividasAtivas.length} dívida(s) ativa(s) totalizando R$ ${totalDividas.toLocaleString('pt-BR')}. Considere priorizá-las.`,
      ativa: true
    });
  }
  
  // Sugestão: Sem dívidas
  if (dividasAtivas.length === 0 && estado.dividas.length > 0) {
    sugestoes.push({
      id: 'sem-dividas',
      tipo: 'sucesso',
      titulo: 'Livre de Dívidas!',
      mensagem: 'Parabéns! Você quitou todas as suas dívidas. Continue assim!',
      ativa: true
    });
  }
  
  // Sugestão: Saldo baixo
  if (saldoTotal < 1000 && saldoTotal > 0) {
    sugestoes.push({
      id: 'saldo-baixo',
      tipo: 'info',
      titulo: 'Atenção ao Saldo',
      mensagem: 'Seu saldo total está baixo. Considere revisar seus gastos.',
      ativa: true
    });
  }
  
  // Sugestão: Metas em progresso
  const metasEmProgresso = estado.metas.filter(m => !m.ehReservaEmergencia && m.valorAcumulado < m.valorAlvo);
  if (metasEmProgresso.length > 0 && (!reservaEmergencia || reservaEmergencia.valorAcumulado >= reservaEmergencia.valorAlvo)) {
    const proximaMeta = metasEmProgresso.sort((a, b) => a.prioridade - b.prioridade)[0];
    const percentual = (proximaMeta.valorAcumulado / proximaMeta.valorAlvo) * 100;
    sugestoes.push({
      id: 'meta-proxima',
      tipo: 'info',
      titulo: `Meta: ${proximaMeta.nome}`,
      mensagem: `Você está em ${percentual.toFixed(0)}% da meta "${proximaMeta.nome}". Continue aportando!`,
      ativa: true
    });
  }
  
  return sugestoes;
}
