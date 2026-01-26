function Categories() {
    const categories=["Music","Tech","Sports","Arts","Workshops"];

    return (
        <section className="section">
            <h2>Explore Categories</h2>

            <div className="card-grid">
                {categories.map((cat,index)=>(
                    <div className="card" key={index}>
                        <h3>{cat}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}
export default Categories;