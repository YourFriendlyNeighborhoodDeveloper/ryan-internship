import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";

const CollectionSkeleton = () => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
      <div className="nft_coll" aria-hidden="true">
        <div
          className="nft_wrap"
          style={{
            height: 220,
            background: "#eeeeee",
            borderRadius: 8,
          }}
        ></div>

        <div className="nft_coll_info">
          <div
            style={{
              width: "70%",
              height: 18,
              background: "#eeeeee",
              borderRadius: 5,
              margin: "16px auto 8px",
            }}
          ></div>

          <div
            style={{
              width: "35%",
              height: 14,
              background: "#eeeeee",
              borderRadius: 5,
              margin: "0 auto",
            }}
          ></div>
        </div>
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

const HotCollections = () => {
  const [hotCollections, setHotCollections] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchHotCollections() {
      try {
        setError(false);

        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );

        setHotCollections(Array.isArray(data) ? data : []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchHotCollections();
  }, []);

  useEffect(() => {
    if (hotCollections.length) {
      AOS.refreshHard();
    }
  }, [hotCollections, startIndex]);

  const visibleCollections =
    hotCollections.length <= 4
      ? hotCollections
      : Array.from(
          { length: 4 },
          (_, index) =>
            hotCollections[(startIndex + index) % hotCollections.length]
        );

  const previous = () => {
    setStartIndex((current) =>
      current === 0 ? hotCollections.length - 1 : current - 1
    );
  };

  const next = () => {
    setStartIndex((current) => (current + 1) % hotCollections.length);
  };

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12" data-aos="fade-up">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
        </div>

        <div className="row" style={{ position: "relative" }}>
          {hotCollections.length > 4 && (
            <>
              <button
                type="button"
                onClick={previous}
                aria-label="Previous collections"
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
                aria-label="Next collections"
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
            !hotCollections.length &&
            new Array(4)
              .fill(0)
              .map((_, index) => <CollectionSkeleton key={index} />)}

          {visibleCollections.map((collection) => {
            const nftId = collection.nftId ?? collection.id;
            const authorId =
              collection.authorId ??
              collection.authorName ??
              collection.id;

            return (
              <div
                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                key={`${nftId}-${startIndex}`}
              >
                <div className="nft_coll" data-aos="fade-up">
                  <div className="nft_wrap">
                    <Link
                      to={`/item-details/${encodeURIComponent(nftId)}`}
                      state={{ item: collection }}
                    >
                      <img
                        src={collection.nftImage}
                        className="lazy img-fluid"
                        alt={collection.title}
                      />
                    </Link>
                  </div>

                  <div className="nft_coll_pp">
                    <Link
                      to={`/author/${encodeURIComponent(authorId)}`}
                      state={{
                        author: {
                          ...collection,
                          authorId,
                        },
                      }}
                    >
                      <img
                        className="lazy pp-coll"
                        src={collection.authorImage}
                        alt={collection.authorName || ""}
                      />
                    </Link>

                    <i className="fa fa-check"></i>
                  </div>

                  <div className="nft_coll_info">
                    <Link
                      to={`/item-details/${encodeURIComponent(nftId)}`}
                      state={{ item: collection }}
                    >
                      <h4>{collection.title}</h4>
                    </Link>

                    <span>
                      {collection.code
                        ? `ERC-${collection.code}`
                        : "ERC-192"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {error && (
            <div className="col-12 text-center">
              <p>Unable to load collections right now.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;