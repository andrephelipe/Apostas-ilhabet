import React from 'react';
import './jogos.css';
import { jogosData } from './jogosData';
import empateImg from '../assets/empate.png'; // Importe a imagem para representar o empate

class Jogos extends React.Component {
  state = {
    nomeApostador: '',
    numero: '',
    valorAposta: '',
    jogos: jogosData,
    apostas: [],
    opcaoSelecionada: null,
    somaOdds: 0,
    timeSelecionado: {},
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSelecionarVencedor = (jogoId, vencedor, odds) => {
    this.setState(prevState => {
      const { apostas, timeSelecionado } = prevState;
      
      const existenteIndex = apostas.findIndex(aposta => aposta.jogoId === jogoId);
  
      const novoTimeSelecionado = { ...timeSelecionado };
      novoTimeSelecionado[jogoId] = vencedor; // Atualiza o timeSelecionado para o jogoId com o vencedor selecionado
  
      const jogoCorrespondente = prevState.jogos.find(jogo => jogo.id === jogoId);
      const { time1, time2 } = jogoCorrespondente || {}; // Se não encontrar o jogo, define vazio para evitar erros
  
      if (existenteIndex !== -1) {
        const novasApostas = [...apostas];
        const apostaExistente = novasApostas[existenteIndex];
        apostaExistente.vencedor = vencedor;
        apostaExistente.odds = odds;
        apostaExistente.time1 = time1; // Adiciona time1 na aposta
        apostaExistente.time2 = time2; // Adiciona time2 na aposta
  
        const novaSomaOdds = novasApostas.reduce((acc, aposta) => acc + aposta.odds, 0);
  
        return {
          apostas: novasApostas,
          somaOdds: novaSomaOdds,
          timeSelecionado: novoTimeSelecionado, // Atualiza o estado timeSelecionado
        };
      } else {
        const novaAposta = { jogoId, vencedor, odds, time1, time2 }; // Cria uma nova aposta com time1 e time2
        const novasApostas = [...apostas, novaAposta];
        const novaSomaOdds = novasApostas.reduce((acc, aposta) => acc + aposta.odds, 0);
  
        return {
          apostas: novasApostas,
          somaOdds: novaSomaOdds,
          timeSelecionado: novoTimeSelecionado, // Atualiza o estado timeSelecionado
        };
      }
    });
  };
  
  handleRemoverAposta = (apostaId) => {
    this.setState(prevState => {
      const novasApostas = prevState.apostas.filter(aposta => aposta.jogoId !== apostaId);
      const novaSomaOdds = novasApostas.reduce((acc, aposta) => acc + aposta.odds, 0);

      return {
        apostas: novasApostas,
        somaOdds: novaSomaOdds,
      };
    });
  };

  formatarDetalhesApostas = (apostas) => {
    return apostas.map(aposta => {
      return `
        Jogo: ${aposta.jogoId} - ${aposta.time1} vs ${aposta.time2}
        Time Escolhido: ${aposta.vencedor}
        Odds: ${aposta.odds.toFixed(2)}
      `;
    }).join('\n');
  };
  

  handleSubmit = event => {
    event.preventDefault();
    
    const { nomeApostador, valorAposta, somaOdds, apostas, numero } = this.state;
    
    const total = somaOdds * valorAposta;
    const formattedTotal = total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  
    const detalhesFormatados = this.formatarDetalhesApostas(apostas);
    
    const mensagem = `
      Nome do Apostador: ${nomeApostador}
      Valor da Aposta: ${valorAposta}
      Telefone: ${numero}
      Total: ${formattedTotal}
      Detalhes das Apostas:\n${detalhesFormatados}
      Odds somadas: ${somaOdds.toFixed(2)}
    `;
  
    const numeroWhatsApp = '5511997021961'; // Seu número de telefone no formato internacional
    const mensagemEncoded = encodeURIComponent(mensagem);
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemEncoded}`;
  
    window.open(linkWhatsApp, '_blank');
  };
  
    
  render() {
    const { nomeApostador, valorAposta, somaOdds, numero } = this.state;

    const total = somaOdds * valorAposta;

// Formatação para representar como dinheiro
  const formattedTotal = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL', // Define a moeda como Real brasileiro
  });
    return (
      <div className='pagina-apostas'>
        <h1>Jogos - Sexta 08/dez</h1>
        {this.state.jogos.map(jogo => (
        <div key={jogo.id} className='jogo'>
          <p>jogo {jogo.id}</p>
          <div className='times-empate'>
            <div className={`time ${this.state.timeSelecionado[jogo.id] === jogo.time1 ? 'selecionado' : ''}`}>
              <button onClick={() => this.handleSelecionarVencedor(jogo.id, jogo.time1, jogo.odds1)}>
              <img src={jogo.logo1} alt={`${jogo.time1} Logo`} />
              </button>
              <p>{jogo.time1}</p>
              <p>Odds: {jogo.odds1.toFixed(2)}</p>
              </div>
              <div className={`empate ${this.state.timeSelecionado[jogo.id] === 'Empate' ? 'selecionado' : ''}`}>
              <button onClick={() => this.handleSelecionarVencedor(jogo.id, 'Empate', jogo.oddsEmpate)}>
                <img src={empateImg} alt="Empate" />
              </button>
              <p>Empate</p>
              <p>Odds: {jogo.oddsEmpate.toFixed(2)}</p>
            </div>
            <div className={`time ${this.state.timeSelecionado[jogo.id] === jogo.time2 ? 'selecionado' : ''}`}>
              <button onClick={() => this.handleSelecionarVencedor(jogo.id, jogo.time2, jogo.odds2)}>
               <img src={jogo.logo2} alt={`${jogo.time2} Logo`} />
                </button>
                <p>{jogo.time2}</p>
                <p>Odds: {jogo.odds2.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="sessao-apostas">
          <h2>Sessão de Apostas</h2>
          {this.state.apostas.map((aposta, index) => (
            <div key={index} className="aposta">
              <p>Jogo: {aposta.jogoId} - {aposta.time1} vs {aposta.time2}</p>
              <p>Time Escolhido: {aposta.vencedor}</p>
              <p>Odds: {aposta.odds.toFixed(2)}</p>
              <button onClick={() => this.handleRemoverAposta(aposta.jogoId, aposta.odds)}>Remover</button>
            </div>
          ))}
          <p>Total: {this.state.somaOdds.toFixed(2)}</p>
        </div>

        <form className='formulario-apostador' onSubmit={this.handleSubmit}>
          <h2>Cliente</h2>
          <label htmlFor="nomeApostador">Nome:</label>
          <input
            type="text"
            id="nomeApostador"
            name="nomeApostador"
            value={nomeApostador}
            onChange={this.handleChange}
          />

          <label htmlFor="numero">Whats com ddd:</label>
          <input
            type="phone"
            id="numero"
            name="numero"
            value={numero}
            onChange={this.handleChange}
          />

          <label htmlFor="valorAposta">Valor:</label>
          <input
            type="number"
            id="valorAposta"
            name="valorAposta"
            value={valorAposta}
            onChange={this.handleChange}
          />

          <button type="submit" onClick={this.handleSubmit}>Enviar</button>
        </form>

        <div>
          <p>Possivel Retorno: {formattedTotal} </p>
        </div>
      </div>
    );
  }
}

export default Jogos;
