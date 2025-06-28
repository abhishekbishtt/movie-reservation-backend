// seed.js - Optimized comprehensive database seeding
const { sequelize, City, Theater, Hall, Movie, Showtime, Seat } = require('./models');

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // 0. Clean up existing data
        console.log('🧹 Cleaning up existing data...');
        await sequelize.query('TRUNCATE TABLE "booked_seats" CASCADE');
        await sequelize.query('TRUNCATE TABLE "payments" CASCADE');
        await sequelize.query('TRUNCATE TABLE "reservations" CASCADE');
        await sequelize.query('TRUNCATE TABLE "seats" CASCADE');
        await sequelize.query('TRUNCATE TABLE "showtimes" CASCADE');
        await sequelize.query('TRUNCATE TABLE "movies" CASCADE');
        await sequelize.query('TRUNCATE TABLE "halls" CASCADE');
        await sequelize.query('TRUNCATE TABLE "theaters" CASCADE');
        await sequelize.query('TRUNCATE TABLE "cities" CASCADE');
        console.log('   ✅ cleanup complete');

        // 1. Create Cities (5 cities for manageable size)
        console.log('📍 Creating cities...');
        const cities = await City.bulkCreate([
            { name: 'Mumbai', state: 'Maharashtra', is_active: true },
            { name: 'Delhi', state: 'Delhi', is_active: true },
            { name: 'Bangalore', state: 'Karnataka', is_active: true },
            { name: 'Chennai', state: 'Tamil Nadu', is_active: true },
            { name: 'Hyderabad', state: 'Telangana', is_active: true }
        ]);
        console.log(`   ✅ Created ${cities.length} cities`);

        // 2. Create Theaters (2 per city = 10 theaters)
        console.log('🎭 Creating theaters...');
        const theaters = await Theater.bulkCreate([
            { name: 'PVR Phoenix', address: 'Phoenix Mills, Lower Parel', city_id: cities[0].id, phone: '022-12345678', is_active: true },
            { name: 'INOX Nariman Point', address: 'Nariman Point, Marine Drive', city_id: cities[0].id, phone: '022-87654321', is_active: true },
            { name: 'PVR Select Citywalk', address: 'Saket, New Delhi', city_id: cities[1].id, phone: '011-12345678', is_active: true },
            { name: 'Cinepolis DLF', address: 'DLF Place, Saket', city_id: cities[1].id, phone: '011-98765432', is_active: true },
            { name: 'INOX Forum Mall', address: 'Koramangala, Bangalore', city_id: cities[2].id, phone: '080-12345678', is_active: true },
            { name: 'PVR Orion Mall', address: 'Rajajinagar, Bangalore', city_id: cities[2].id, phone: '080-87654321', is_active: true },
            { name: 'Sathyam Cinemas', address: 'Royapettah, Chennai', city_id: cities[3].id, phone: '044-12345678', is_active: true },
            { name: 'PVR VR Mall', address: 'Anna Nagar, Chennai', city_id: cities[3].id, phone: '044-87654321', is_active: true },
            { name: 'PVR IMAX', address: 'Banjara Hills, Hyderabad', city_id: cities[4].id, phone: '040-12345678', is_active: true },
            { name: 'AMB Cinemas', address: 'Gachibowli, Hyderabad', city_id: cities[4].id, phone: '040-87654321', is_active: true }
        ]);
        console.log(`   ✅ Created ${theaters.length} theaters`);

        // 3. Create Halls (2 per theater = 20 halls, smaller sizes)
        console.log('🏛️ Creating halls...');
        const hallsData = [];
        theaters.forEach((theater, i) => {
            hallsData.push(
                { name: `${theater.name} - Screen 1`, theater_id: theater.id, total_rows: 8, seats_per_row: 10, total_seats: 80, screen_type: 'IMAX', sound_system: 'Dolby_Atmos', is_active: true },
                { name: `${theater.name} - Screen 2`, theater_id: theater.id, total_rows: 6, seats_per_row: 8, total_seats: 48, screen_type: '3D', sound_system: 'Dolby_Digital', is_active: true }
            );
        });
        const halls = await Hall.bulkCreate(hallsData);
        console.log(`   ✅ Created ${halls.length} halls`);

        // 4. Create Movies (13 movies with AI-generated posters)
        console.log('🎬 Creating movies...');
        const movies = await Movie.bulkCreate([
            { id: 'movie-1', title: 'Pushpa 2: The Rule', description: 'Pushpa Raj returns in this action-packed sequel.', genre: ['Action', 'Drama'], age_rating: 'UA', duration: 180, language: 'Telugu', poster_url: '/posters/pushpa2.png', release_date: '2024-12-05', is_trending: true, is_active: true, rating: 8.5, director: 'Sukumar', cast: 'Allu Arjun, Rashmika Mandanna' },
            { id: 'movie-2', title: 'Mufasa: The Lion King', description: 'The origin story of Mufasa.', genre: ['Animation', 'Adventure'], age_rating: 'U', duration: 118, language: 'English', poster_url: '/posters/mufasa.png', release_date: '2024-12-20', is_trending: true, is_active: true, rating: 7.8, director: 'Barry Jenkins', cast: 'Aaron Pierre, Seth Rogen' },
            { id: 'movie-3', title: 'Bhool Bhulaiyaa 3', description: 'Horror-comedy in a haunted mansion.', genre: ['Horror', 'Comedy'], age_rating: 'UA', duration: 158, language: 'Hindi', poster_url: '/posters/bhool-bhulaiyaa-3.png', release_date: '2024-11-01', is_trending: true, is_active: true, rating: 7.2, director: 'Anees Bazmee', cast: 'Kartik Aaryan, Vidya Balan' },
            { id: 'movie-4', title: 'Singham Again', description: 'The cop universe returns.', genre: ['Action', 'Thriller'], age_rating: 'UA', duration: 165, language: 'Hindi', poster_url: '/posters/singham-again.png', release_date: '2024-11-01', is_trending: true, is_active: true, rating: 7.5, director: 'Rohit Shetty', cast: 'Ajay Devgn, Akshay Kumar' },
            { id: 'movie-5', title: 'Gladiator II', description: 'Lucius enters the Colosseum.', genre: ['Action', 'Drama'], age_rating: 'A', duration: 148, language: 'English', poster_url: '/posters/gladiator-2.png', release_date: '2024-11-15', is_trending: true, is_active: true, rating: 8.0, director: 'Ridley Scott', cast: 'Paul Mescal, Denzel Washington' },
            { id: 'movie-6', title: 'Moana 2', description: 'Moana sets out on a new voyage.', genre: ['Animation', 'Adventure'], age_rating: 'U', duration: 100, language: 'English', poster_url: '/posters/moana-2.png', release_date: '2024-11-27', is_trending: true, is_active: true, rating: 7.6, director: 'David Derrick Jr.', cast: "Auli'i Cravalho, Dwayne Johnson" },
            { id: 'movie-7', title: 'Starbound Odyssey', description: 'Journey to the edge of the galaxy.', genre: ['Sci-Fi', 'Adventure'], age_rating: 'UA', duration: 145, language: 'English', poster_url: '/posters/starbound-odyssey.png', release_date: '2025-01-10', is_trending: false, is_active: true, rating: 8.2, director: 'James Cameron', cast: 'Zoe Saldana' },
            { id: 'movie-8', title: 'The Midnight Manor', description: 'Dark secrets in a mansion.', genre: ['Horror', 'Mystery'], age_rating: 'A', duration: 110, language: 'English', poster_url: '/posters/midnight-manor.png', release_date: '2024-12-30', is_trending: false, is_active: true, rating: 7.0, director: 'Ari Aster', cast: 'Florence Pugh' },
            { id: 'movie-9', title: 'Neon Racing 2050', description: 'Futuristic high-speed racing.', genre: ['Action', 'Sci-Fi'], age_rating: 'UA', duration: 130, language: 'English', poster_url: '/posters/neon-racing-2050.png', release_date: '2025-02-14', is_trending: true, is_active: true, rating: 8.8, director: 'George Miller', cast: 'Tom Hardy' },
            { id: 'movie-10', title: 'The Emerald Quest', description: 'Warriors seek a legendary artifact.', genre: ['Fantasy', 'Adventure'], age_rating: 'U', duration: 155, language: 'English', poster_url: '/posters/emerald-quest.png', release_date: '2025-03-20', is_trending: false, is_active: true, rating: 7.9, director: 'Peter Jackson', cast: 'Ian McKellen' },
            { id: 'movie-11', title: 'Silicon Shadows', description: 'A hacker uncovers a conspiracy.', genre: ['Thriller', 'Crime'], age_rating: 'UA', duration: 125, language: 'English', poster_url: '/posters/silicon-shadows.png', release_date: '2025-04-05', is_trending: true, is_active: true, rating: 8.4, director: 'Christopher Nolan', cast: 'Cillian Murphy' },
            { id: 'movie-12', title: 'Love in Kyoto', description: 'Romance amidst cherry blossoms.', genre: ['Romance', 'Drama'], age_rating: 'U', duration: 115, language: 'Japanese', poster_url: '/posters/love-in-kyoto.png', release_date: '2025-05-01', is_trending: false, is_active: true, rating: 8.1, director: 'Makoto Shinkai', cast: 'Takeru Satoh' },
            { id: 'movie-13', title: 'Viking Fury', description: 'A Viking warrior reclaims his land.', genre: ['Action', 'History'], age_rating: 'A', duration: 140, language: 'English', poster_url: '/posters/viking-fury.png', release_date: '2025-06-12', is_trending: true, is_active: true, rating: 7.7, director: 'Robert Eggers', cast: 'Alexander Skarsgard' }
        ]);
        console.log(`   ✅ Created ${movies.length} movies`);

        // 5. Create Showtimes (3 days, 2 shows per hall = 120 showtimes)
        console.log('🕐 Creating showtimes...');
        const today = new Date();
        const showtimesData = [];

        for (let day = 0; day < 3; day++) {
            const showDate = new Date(today);
            showDate.setDate(showDate.getDate() + day);
            const dateStr = showDate.toISOString().split('T')[0];

            halls.forEach((hall, hIndex) => {
                const movieIndex = (hIndex + day) % movies.length;
                showtimesData.push(
                    { movie_id: movies[movieIndex].id, hall_id: hall.id, show_date: dateStr, show_time: '14:00:00', end_time: '17:00:00', price: hall.screen_type === 'IMAX' ? 450.00 : 300.00, available_seats: hall.total_seats, is_active: true },
                    { movie_id: movies[(movieIndex + 1) % movies.length].id, hall_id: hall.id, show_date: dateStr, show_time: '19:00:00', end_time: '22:00:00', price: hall.screen_type === 'IMAX' ? 500.00 : 350.00, available_seats: hall.total_seats, is_active: true }
                );
            });
        }

        const createdShowtimes = await Showtime.bulkCreate(showtimesData);
        console.log(`   ✅ Created ${createdShowtimes.length} showtimes`);

        // 6. Create ALL Seats in one bulk operation (much faster!)
        console.log('💺 Creating seats...');
        const allSeatsData = [];
        halls.forEach(hall => {
            for (let row = 1; row <= hall.total_rows; row++) {
                for (let seat = 1; seat <= hall.seats_per_row; seat++) {
                    allSeatsData.push({
                        hall_id: hall.id,
                        row_number: row,
                        seat_number: seat,
                        seat_type: row <= 2 ? 'premium' : 'regular',
                        is_wheelchair_accessible: row === hall.total_rows && seat <= 2,
                        is_active: true
                    });
                }
            }
        });
        await Seat.bulkCreate(allSeatsData);
        console.log(`   ✅ Created ${allSeatsData.length} seats`);

        console.log('\n🎉 Database seeding completed!');
        console.log(`\n📊 Summary: ${cities.length} cities, ${theaters.length} theaters, ${halls.length} halls, ${movies.length} movies, ${createdShowtimes.length} showtimes, ${allSeatsData.length} seats`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
