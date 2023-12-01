import React from 'react';
import './Header.css'; // Importe seu arquivo CSS para o componente

class Header extends React.Component {
  render() {
    return (
      <header className="ilhabet365-header">
        <div className="logo">
          <h1>Ilhabet365</h1>
        </div>
        <nav className="menu">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">Sobre</a></li>
            <li><a href="#services">Serviços</a></li>
            <li><a href="#contact">Contato</a></li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
