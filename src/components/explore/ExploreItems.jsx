import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import Countdown from "../UI/Countdown";

const ExploreSkeleton = () => {
  return (
    <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
      <div className="nft__item" aria-hidden="true">
        <div
          style={{
            height: 260,
            background: "#eeeeee",
            borderRadius: 8,
          }}
        ></div>

        <div
          style={{
            width: "70%",
            height: 18,
            background: "#eeeeee",
            borderRadius: 5,
            marginTop: 16,
          }}
        ></div>

        <div
          style={{
            width: "40%",
            height: 14,
            background: "#eeeeee",
            borderRadius: 5,
            marginTop: 10,
          }}
        ></div>
      </div>
    </div>
  );
};

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [visibleItems, setVisibleItems] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      try {
        setError(false);

        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
        );

        setItems(Array.isArray(data) ? data : []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  useEffect(() => {
    if (items.length) {
      AOS.refreshHard();
    }
  }, [items, visibleItems, filter]);

  const filteredItems = [...items].sort((a, b) => {
    if (filter === "price_low_to_high") {
      return Number(a.price) - Number(b.price);
    }

    if (filter === "price_high_to_low") {
      return Number(b.price) - Number(a.price);
    }

    if (filter === "likes_high_to_low") {
      return Number(b.likes) - Number(a.likes);
    }

    return 0;
  });

  return (
    <>
      <div>
        <select
          id="filter-items"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {(loading || error) &&
        !items.length &&
        new Array(8)
          .fill(0)
          .map((_, index) => <ExploreSkeleton key={index} />)}

      {filteredItems.slice(0, visibleItems).map((item) => {
        const nftId = item.nftId ?? item.id;
        const authorId =
          item.authorId ??
          item.authorName ??
          item.id;

        return (
          <div
            key={nftId}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
            style={{
              display: "block",
              backgroundSize: "cover",
            }}
          >
            <div className="nft__item" data-aos="fade-up">
              <div className="author_list_pp">
                <Link
                  to={`/author/${encodeURIComponent(authorId)}`}
                  state={{
                    author: {
                      ...item,
                      authorId,
                    },
                  }}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                >
                  <img
                    className="lazy"
                    src={item.authorImage}
                    alt={item.authorName || ""}
                  />

                  <i className="fa fa-check"></i>
                </Link>
              </div>

              {item.expiryDate && (
                <div className="de_countdown">
                  <Countdown expiryDate={item.expiryDate} />
                </div>
              )}

              <div className="nft__item_wrap">
                <div className="nft__item_extra">
                  <div className="nft__item_buttons">
                    <button>Buy Now</button>
                  </div>
                </div>

                <Link
                  to={`/item-details/${encodeURIComponent(nftId)}`}
                  state={{ item }}
                >
                  <img
                    src={item.nftImage}
                    className="lazy nft__item_preview"
                    alt={item.title}
                  />
                </Link>
              </div>

              <div className="nft__item_info">
                <Link
                  to={`/item-details/${encodeURIComponent(nftId)}`}
                  state={{ item }}
                >
                  <h4>{item.title}</h4>
                </Link>

                <div className="nft__item_price">
                  {item.price} ETH
                </div>

                <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                  <span>{item.likes}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {error && (
        <div className="col-md-12 text-center">
          <p>Unable to load NFT items right now.</p>
        </div>
      )}

      {visibleItems < filteredItems.length && (
        <div className="col-md-12 text-center">
          <button
            id="loadmore"
            className="btn-main lead"
            onClick={() =>
              setVisibleItems((current) => current + 4)
            }
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;