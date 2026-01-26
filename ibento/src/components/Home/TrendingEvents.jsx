function TrendingEvents(){
    const events = ["Hackathon","Sports Meet","Workshop","Art Fest"];
    return (
        <section className="section">
            <h2>Trending Events This Week</h2>
            <div className="card-grid">
                {events.map((events,index) => (
                    <div className="card" key={index}>
                        <h3>{events}</h3>
                        <p>12th June 2026</p>
                        <button className="primary-btn">Book Now</button>
                    </div>
                ))}
            </div>
        </section>
    );

}

export default TrendingEvents;