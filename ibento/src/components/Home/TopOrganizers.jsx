function TopOrganizers(){
    const clubs = ["IEEE","IEDC","MuLearn","FOCES"];
    return(
        <section className="section">
            <h2>Top Organizers</h2>
            <div className="card-grid">
                {clubs.map((clubs,index)=> (
                    <div className="card" key={index}>
                        <h3>{clubs}</h3>
                        <p>{Math.floor(Math.random() *50)} Events</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
export default TopOrganizers;