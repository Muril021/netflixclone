import React, { useEffect, useState } from "react";

import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";

import "./App.css";
import Header from "./components/Header";

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // pegando o featured
      let originals = list.filter(i => i.slug === 'originals');
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />
      {featuredData && 
        <FeaturedMovie item={featuredData} />
      }
      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
      <footer>
        Feito por Murilo<br/>
        Direitos de imagem para Netflix<br/>
        Dados pegos do site Themoviedb.org
      </footer>
      {movieList.length <= 0 &&
        <div className="loading">
          <img 
            src="https://blog.motionisland.com/wp-content/uploads/2022/03/Loading_1.gif" 
            alt="Carregando" 
          />
        </div>
      }
    </div>
  );
}