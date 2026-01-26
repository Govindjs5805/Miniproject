import Hero from "../components/Home/Hero";
import Stats from "../components/Home/Stats";
import TrendingEvents from "../components/Home/TrendingEvents";
import Categories from "../components/Home/Categories";
import CTA from "../components/Home/CTA";

function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <TrendingEvents />
      <Categories />
      <CTA />
    </>
  );
}

export default Home;
