import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";

const TopSellers = () => {
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchTopSellers() {
      try {
        setError(false);

        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
        );

        setTopSellers(Array.isArray(data) ? data : []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
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
              {(loading || error) &&
                !topSellers.length &&
                new Array(8).fill(0).map((_, index) => (
                  <li key={index}>
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        background: "#eeeeee",
                        marginRight: 12,
                      }}
                    ></div>

                    <div>
                      <div
                        style={{
                          width: 120,
                          height: 15,
                          background: "#eeeeee",
                          borderRadius: 4,
                          marginBottom: 8,
                        }}
                      ></div>

                      <div
                        style={{
                          width: 70,
                          height: 12,
                          background: "#eeeeee",
                          borderRadius: 4,
                        }}
                      ></div>
                    </div>
                  </li>
                ))}

              {topSellers.map((seller) => {
                const authorId =
                  seller.authorId ??
                  seller.authorName ??
                  seller.id;

                return (
                  <li key={seller.id} data-aos="fade-up">
                    <div className="author_list_pp">
                      <Link
                        to={`/author/${encodeURIComponent(authorId)}`}
                        state={{
                          author: {
                            ...seller,
                            authorId,
                          },
                        }}
                      >
                        <img
                          className="lazy pp-author"
                          src={seller.authorImage}
                          alt={seller.authorName}
                        />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>

                    <div className="author_list_info">
                      <Link
                        to={`/author/${encodeURIComponent(authorId)}`}
                        state={{
                          author: {
                            ...seller,
                            authorId,
                          },
                        }}
                      >
                        {seller.authorName}
                      </Link>

                      <span>{seller.price} ETH</span>
                    </div>
                  </li>
                );
              })}
            </ol>

            {error && (
              <div className="text-center">
                <p>Unable to load top sellers right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;