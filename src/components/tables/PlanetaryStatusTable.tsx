import React from 'react';

interface PlanetaryStatus {
    planet: string;
    movement: string;
    combustion: string;
    star_lord: string;
    status: string;
}

interface PlanetaryStatusTableProps {
    status: PlanetaryStatus[];
}

const PlanetaryStatusTable: React.FC<PlanetaryStatusTableProps> = ({ status }) => {
    const getStatusColor = (s: string) => {
        switch (s) {
            case 'Strong Positive': return '#059669';
            case 'Positive': return '#10b981';
            case 'Mixed': return '#f59e0b';
            case 'Negative': return '#ef4444';
            case 'Weak': return '#94a3b8';
            default: return '#1e293b';
        }
    };

    return (
        <div className="card" style={{
            width: '100%',
            maxWidth: '100%',
            padding: '1rem 0.5rem',
            borderTop: '5px solid var(--primary)',
            marginTop: '1rem',
            background: 'var(--secondary-light)',
            border: '3px solid #000000',
            borderRadius: '0'
        }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text)', fontWeight: 800 }}>Planetary Status</h2>
            <div className="table-container">
                <table style={{ fontSize: '0.8125rem' }}>
                    <thead>
                        <tr style={{ background: 'var(--primary)' }}>
                            <th style={{ color: '#000000' }}>Planet</th>
                            <th style={{ color: '#000000' }}>Movement</th>
                            <th style={{ color: '#000000' }}>Combust</th>
                            <th style={{ color: '#000000' }}>NL</th>
                            <th style={{ color: '#000000' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {status.map((item) => (
                            <tr key={item.planet}>
                                <td style={{ fontWeight: 600 }}>{item.planet}</td>
                                <td>{item.movement}</td>
                                <td>{item.combustion}</td>
                                <td>{item.star_lord}</td>
                                <td style={{ fontWeight: 700, color: getStatusColor(item.status) }}>
                                    {item.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlanetaryStatusTable;
