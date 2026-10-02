import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import Countdown from "../UI/Countdown";

const ItemSkeleton = () => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
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

const arrowStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "1px solid #dddddd",
  background: "#ffffff",
  color: "#555555",
  fontSize: 24,
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
  zIndex: 10,
  cursor: "pointer",
};

const NewItems = () => {
  const [newItems, setNewItems] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchNewItems() {
      try {
        setError(false);

        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );

        setNewItems(Array.isArray(data) ? data : []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchNewItems();
  }, []);

  useEffect(() => {
    if (newItems.length) {
      AOS.refreshHard();
    }
  }, [newItems, startIndex]);

  const visibleItems =
    newItems.length <= 4
      ? newItems
      : Array.from(
          { length: 4 },
          (_, index) => newItems[(startIndex + index) % newItems.length]
        );

  const previous = () => {
    setStartIndex((current) =>
      current === 0 ? newItems.length - 1 : current - 1
    );
  };

  const next = () => {
    setStartIndex((current) => (current + 1) % newItems.length);
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12" data-aos="fade-up">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
        </div>

        <div className="row" style={{ position: "relative" }}>
          {newItems.length > 4 && (
            <>
              <button
                type="button"
                onClick={previous}
                aria-label="Previous items"
                style={{
                  ...arrowStyle,
                  left: 8,
                }}
              >
                <i className="fa fa-angle-left"></i>
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next items"
                style={{
                  ...arrowStyle,
                  right: 8,
                }}
              >
                <i className="fa fa-angle-right"></i>
              </button>
            </>
          )}

          {(loading || error) &&
            !newItems.length &&
            new Array(4)
              .fill(0)
              .map((_, index) => <ItemSkeleton key={index} />)}

          {visibleItems.map((item) => {
            const nftId = item.nftId ?? item.id;
            const authorId =
              item.authorId ??
              item.authorName ??
              item.id;

            return (
              <div
                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                key={`${nftId}-${startIndex}`}
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
                      title={`Creator: ${item.authorName || ""}`}
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
            <div className="col-12 text-center">
              <p>Unable to load new items right now.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;