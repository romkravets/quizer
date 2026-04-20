// КООРДИНАТОР МЫШЫ ДЛЯ ВИЗНАЧЕННЯ КООРДИНАТ НА SVG
// Додайте цей компонент тимчасово для визначення координат міст на вашій карті

import { useState } from 'react';
import Image from 'next/image';

export default function CoordinateFinder({ regionName }) {
  const [coordinates, setCoordinates] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleSvgClick = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const cityName = prompt('Назва міста:');
    if (cityName) {
      const newCoord = {
        id: `${regionName.toLowerCase()}-${coordinates.length + 1}`,
        name: cityName,
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(y.toFixed(2)),
        description: prompt('Короткий опис:') || '',
        population: prompt('Населення:') || '',
        founded: prompt('Рік заснування:') || '',
      };

      setCoordinates([...coordinates, newCoord]);
      console.log('📍 Нова координата:', newCoord);
    }
  };

  const handleMouseMove = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePos({ x: x.toFixed(2), y: y.toFixed(2) });
  };

  const exportJSON = () => {
    const json = JSON.stringify(coordinates, null, 2);
    console.log('📋 JSON з координатами:');
    console.log(json);

    // Копіювати в буфер обміну
    navigator.clipboard.writeText(json);
    alert('JSON скопійовано в буфер обміну!');
  };

  const copyToCode = () => {
    const code = `// Для файлу citiesData.js
${regionName}: [
${coordinates
  .map(
    (c) => `  {
    id: '${c.id}',
    name: '${c.name}',
    x: ${c.x},
    y: ${c.y},
    description: '${c.description}',
    population: '${c.population}',
    founded: '${c.founded}',
    info: 'TODO: Додайте детальну інформацію',
    attractions: ['TODO: Додайте визначні місця'],
    imageUrl: '/cities/${c.name.toLowerCase().replace(/\\s+/g, '-')}.jpg'
  },`
  )
  .join('\n')}
],`;

    console.log('📝 Код для вставки:');
    console.log(code);
    navigator.clipboard.writeText(code);
    alert('Код скопійовано в буфер обміну!');
  };

  const clear = () => {
    setCoordinates([]);
  };

  return (
    <div style={{ padding: '20px', background: '#f5f0e8', borderRadius: '12px' }}>
      <h2>🗺️ Координатор міст для {regionName}</h2>
      <p style={{ color: '#8b6f47' }}>
        Клікайте на карту щоб додати міста. Координати відображаються внизу.
      </p>

      {/* SVG Карта */}
      <svg
        viewBox="0 0 100 100"
        width="400"
        height="300"
        onClick={handleSvgClick}
        onMouseMove={handleMouseMove}
        style={{
          border: '2px solid #d2a048',
          borderRadius: '8px',
          cursor: 'crosshair',
          display: 'block',
          marginBottom: '20px',
          background: 'linear-gradient(to bottom, #e8dcc8 0%, #f5e6d3 100%)',
        }}
      >
        {/* Карта як фон */}
        <image
          href={`/region-map/${regionName}.jpeg`}
          x="0"
          y="0"
          width="100"
          height="100"
          preserveAspectRatio="none"
        />

        {/* Відображення доданих точок */}
        {coordinates.map((coord) => (
          <g key={coord.id}>
            <circle
              cx={coord.x}
              cy={coord.y}
              r="1.5"
              fill="#d2a048"
              stroke="white"
              strokeWidth="0.2"
            />
            <text
              x={coord.x}
              y={coord.y - 2}
              textAnchor="middle"
              fontSize="1"
              fill="#2c1810"
              fontWeight="bold"
            >
              {coord.name}
            </text>
          </g>
        ))}

        {/* Крос-хер на позиції миші */}
        <g style={{ pointerEvents: 'none', opacity: 0.5 }}>
          <line x1={mousePos.x} y1="0" x2={mousePos.x} y2="100" stroke="#d2a048" strokeWidth="0.2" />
          <line x1="0" y1={mousePos.y} x2="100" y2={mousePos.y} stroke="#d2a048" strokeWidth="0.2" />
        </g>
      </svg>

      {/* Info на позиції миші */}
      <div
        style={{
          padding: '12px',
          background: 'white',
          border: '1px solid #d2a048',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '12px',
          color: '#2c1810',
        }}
      >
        <strong>Позиція миші:</strong> X: {mousePos.x}%, Y: {mousePos.y}%
      </div>

      {/* Доданы координати */}
      <div
        style={{
          background: 'white',
          border: '1px solid #d2a048',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '20px',
          maxHeight: '300px',
          overflowY: 'auto',
        }}
      >
        <h4 style={{ margin: '0 0 12px 0' }}>
          ✅ Додано координат: {coordinates.length}
        </h4>
        {coordinates.length > 0 ? (
          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e0d5c8' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Міста</th>
                <th style={{ textAlign: 'center', padding: '8px' }}>X</th>
                <th style={{ textAlign: 'center', padding: '8px' }}>Y</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Дія</th>
              </tr>
            </thead>
            <tbody>
              {coordinates.map((coord, idx) => (
                <tr key={coord.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '8px' }}>{coord.name}</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{coord.x}</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{coord.y}</td>
                  <td style={{ padding: '8px' }}>
                    <button
                      onClick={() => setCoordinates(coordinates.filter((_, i) => i !== idx))}
                      style={{
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                      }}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#8b6f47', margin: 0 }}>Клікайте на карту щоб додати міста...</p>
        )}
      </div>

      {/* Кнопки дій */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={copyToCode}
          style={{
            padding: '10px 16px',
            background: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px',
          }}
          disabled={coordinates.length === 0}
        >
          📋 Копіювати в код
        </button>

        <button
          onClick={exportJSON}
          style={{
            padding: '10px 16px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px',
          }}
          disabled={coordinates.length === 0}
        >
          📋 Експортувати JSON
        </button>

        <button
          onClick={clear}
          style={{
            padding: '10px 16px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px',
          }}
        >
          🗑️ Очистити
        </button>
      </div>

      {/* Інструкції */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          background: '#faf7f2',
          border: '1px solid #d2a048',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#3d2817',
          lineHeight: '1.6',
        }}
      >
        <h4 style={{ margin: '0 0 12px 0' }}>📌 Інструкції:</h4>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Клікайте на карту де розташовані міста</li>
          <li>Введіть назву міста, опис, населення, дату</li>
          <li>Координати будуть додані в таблицю</li>
          <li>Натисніть "📋 Копіювати в код" щоб отримати готовий JavaScript код</li>
          <li>Вставте код у файл <code>citiesData.js</code></li>
        </ol>
      </div>

      {/* Результат */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          background: '#f0f8ff',
          border: '1px solid #3498db',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#2c3e50',
          maxHeight: '200px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        <strong>💾 Результат (видно в консолі F12):</strong>
        <br />
        {coordinates.length > 0
          ? `${coordinates.length} координат готово до вставки`
          : 'Результат буде відображен тут...'}
      </div>
    </div>
  );
}

// ВИКОРИСТАННЯ:
// import CoordinateFinder from '@/components/CoordinateFinder';
// <CoordinateFinder regionName="Kyiv" />
