import React from 'react';

interface MahadashaPredictionProps {
    prediction: string;
}

const MahadashaPrediction: React.FC<MahadashaPredictionProps> = ({ prediction }) => {
    return (
        <div className="card" style={{
            width: '100%',
            padding: '1.5rem',
            borderTop: '5px solid #10b981',
            marginTop: '1rem',
            background: '#f0fdf4'
        }}>
            <h2 style={{ marginBottom: '1rem', color: '#064e3b' }}>Mahadasha Prediction</h2>
            <p style={{
                color: '#065f46',
                lineHeight: 1.6,
                fontSize: '1rem',
                fontWeight: 500
            }}>
                {prediction}
            </p>
        </div>
    );
};

export default MahadashaPrediction;
