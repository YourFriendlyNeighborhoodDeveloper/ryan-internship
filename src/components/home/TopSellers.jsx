import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";

const TopSellers = () => {
  const [topSellers, setTopSellers] = useState([]);

  useEffect(() => {
    async function fetchTopSellers() {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
      );

      setTopSellers(data);
    }

    fetchTopSellers();
  }, []);

  useEffect(() => {
    if (topSellers.length) {
      AOS.refreshHard();
    }
  }, [topSellers]);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12" data-aos="fade-up">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-md-12">
            <ol className="author_list">
              {topSellers.map((seller) => (
                <li key={seller.id} data-aos="fade-up">
                  <div className="author_list_pp">
                    <Link to="/author">
                      <img
                        className="lazy pp-author"
                        src={seller.authorImage}
                        alt={seller.authorName}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>

                  <div className="author_list_info">
                    <Link to="/author">{seller.authorName}</Link>
                    <span>{seller.price} ETH</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;