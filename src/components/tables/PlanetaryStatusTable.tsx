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
            borderTop: '5px solid #8b5cf6',
            marginTop: '1rem'
        }}>
            <h2 style={{ marginBottom: '1rem', color: '#1e3a8a' }}>Planetary Status</h2>
            <div className="table-container">
                <table style={{ fontSize: '0.8125rem' }}>
                    <thead>
                        <tr>
                            <th>Planet</th>
                            <th>Movement</th>
                            <th>Combust</th>
                            <th>NL</th>
                            <th>Status</th>
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
