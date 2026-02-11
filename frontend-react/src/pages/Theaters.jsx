import { MapPin, Film, Users } from 'lucide-react';
import { Card } from '@components/common/Card';
import './Theaters.css';

// Placeholder theater data
const MOCK_THEATERS = [
    {
        id: 1,
        name: 'CineBook Multiplex - City Center',
        address: '123 Main Street, City Center, Mumbai',
        halls: 6,
        amenities: ['IMAX', 'Dolby Atmos', '4DX'],
    },
    {
        id: 2,
        name: 'CineBook Premium - Mall Road',
        address: '456 Mall Road, Suburban Area, Mumbai',
        halls: 4,
        amenities: ['3D', 'Dolby Atmos'],
    },
    {
        id: 3,
        name: 'CineBook Classic - Heritage Street',
        address: '789 Heritage Street, Old Town, Mumbai',
        halls: 3,
        amenities: ['2D'],
    },
];

export default function Theaters() {
    return (
        <div className="theaters-page">
            <div className="container">
                <div className="theaters-header">
                    <h1>Theaters</h1>
                    <p>Find CineBook theaters near you</p>
                </div>

                <div className="theaters-grid">
                    {MOCK_THEATERS.map((theater) => (
                        <Card key={theater.id} variant="default" hover className="theater-card">
                            <div className="theater-card-content">
                                <div className="theater-icon">
                                    <Film size={24} />
                                </div>

                                <h3 className="theater-name">{theater.name}</h3>

                                <div className="theater-address">
                                    <MapPin size={14} />
                                    <span>{theater.address}</span>
                                </div>

                                <div className="theater-info">
                                    <span className="theater-halls">
                                        <Users size={14} />
                                        {theater.halls} Screens
                                    </span>
                                </div>

                                {theater.amenities.length > 0 && (
                                    <div className="theater-amenities">
                                        {theater.amenities.map((amenity) => (
                                            <span key={amenity} className="amenity-tag">{amenity}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="theaters-coming-soon">
                    <p>More theaters coming soon to your city!</p>
                </div>
            </div>
        </div>
    );
}
