import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import EthImage from "../images/ethereum.svg";

const readResult = (result) => {
  if (
    result.status === "fulfilled" &&
    Array.isArray(result.value.data)
  ) {
    return result.value.data;
  }

  return [];
};

const matchesItem = (item, key) => {
  const values = [item.nftId, item.id];

  return values.some(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value) === String(key)
  );
};

const ItemDetails = () => {
  const { nftId } = useParams();
  const location = useLocation();

  const [item, setItem] = useState(
    location.state?.item || null
  );

  const [loading, setLoading] = useState(
    !location.state?.item
  );

  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    let active = true;

    async function fetchItem() {
      setLoading(true);
      setError(false);

      try {
        const results = await Promise.allSettled([
          axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
          ),
          axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
          ),
          axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
          ),
        ]);

        const exploreItems = readResult(results[0]);
        const newItems = readResult(results[1]);
        const collections = readResult(results[2]);

        const allItems = [
          ...exploreItems,
          ...newItems,
          ...collections,
        ];

        const stateItem = location.state?.item || null;

        const requestedId =
          nftId ||
          stateItem?.nftId ||
          stateItem?.id;

        const decodedId = requestedId
          ? decodeURIComponent(String(requestedId))
          : null;

        const matchedItem = allItems.find((entry) =>
          matchesItem(entry, decodedId)
        );

        const resolvedItem = matchedItem
          ? {
              ...(stateItem || {}),
              ...matchedItem,
            }
          : stateItem;

        if (!active) {
          return;
        }

        if (resolvedItem) {
          setItem(resolvedItem);
        } else {
          setError(true);
        }
      } catch {
        if (active && !location.state?.item) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchItem();

    return () => {
      active = false;
    };
  }, [nftId]);

  if (loading && !item) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>

          <section
            aria-label="section"
            className="mt90 sm-mt-0"
          >
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div
                    style={{
                      height: 500,
                      background: "#eeeeee",
                      borderRadius: 10,
                    }}
                  ></div>
                </div>

                <div className="col-md-6">
                  <div
                    style={{
                      width: "60%",
                      height: 32,
                      background: "#eeeeee",
                      borderRadius: 5,
                      marginBottom: 20,
                    }}
                  ></div>

                  <div
                    style={{
                      width: "100%",
                      height: 120,
                      background: "#eeeeee",
                      borderRadius: 5,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <section
            aria-label="section"
            className="mt90 sm-mt-0"
          >
            <div className="container text-center">
              <h2>Item unavailable</h2>
              <p>
                This NFT could not be loaded.
              </p>
              <Link to="/explore" className="btn-main">
                Back to Explore
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const authorId =
    item.authorId ??
    item.authorName ??
    item.id;

  const ownerId =
    item.ownerId ??
    item.ownerName ??
    authorId;

  const authorName =
    item.authorName ||
    item.creatorName ||
    "Unknown Creator";

  const ownerName =
    item.ownerName ||
    authorName;

  const authorImage =
    item.authorImage ||
    item.ownerImage;

  const ownerImage =
    item.ownerImage ||
    authorImage;

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          aria-label="section"
          className="mt90 sm-mt-0"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={item.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={item.title || ""}
                />
              </div>

              <div className="col-md-6">
                <div className="item_info">
                  <h2>{item.title}</h2>

                  <div className="item_info_counts">
                    {item.views !== undefined && (
                      <div className="item_info_views">
                        <i className="fa fa-eye"></i>
                        {item.views}
                      </div>
                    )}

                    {item.likes !== undefined && (
                      <div className="item_info_like">
                        <i className="fa fa-heart"></i>
                        {item.likes}
                      </div>
                    )}
                  </div>

                  <p>
                    {item.description ||
                      "No description available for this NFT."}
                  </p>

                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>

                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link
                            to={`/author/${encodeURIComponent(
                              ownerId
                            )}`}
                            state={{
                              author: {
                                authorId: ownerId,
                                authorName: ownerName,
                                authorImage: ownerImage,
                              },
                            }}
                          >
                            {ownerImage && (
                              <img
                                className="lazy"
                                src={ownerImage}
                                alt={ownerName}
                              />
                            )}

                            <i className="fa fa-check"></i>
                          </Link>
                        </div>

                        <div className="author_list_info">
                          <Link
                            to={`/author/${encodeURIComponent(
                              ownerId
                            )}`}
                            state={{
                              author: {
                                authorId: ownerId,
                                authorName: ownerName,
                                authorImage: ownerImage,
                              },
                            }}
                          >
                            {ownerName}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>

                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link
                            to={`/author/${encodeURIComponent(
                              authorId
                            )}`}
                            state={{
                              author: {
                                authorId,
                                authorName,
                                authorImage,
                              },
                            }}
                          >
                            {authorImage && (
                              <img
                                className="lazy"
                                src={authorImage}
                                alt={authorName}
                              />
                            )}

                            <i className="fa fa-check"></i>
                          </Link>
                        </div>

                        <div className="author_list_info">
                          <Link
                            to={`/author/${encodeURIComponent(
                              authorId
                            )}`}
                            state={{
                              author: {
                                authorId,
                                authorName,
                                authorImage,
                              },
                            }}
                          >
                            {authorName}
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="spacer-40"></div>

                    {item.price !== undefined && (
                      <>
                        <h6>Price</h6>

                        <div className="nft-item-price">
                          <img src={EthImage} alt="" />
                          <span>{item.price}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {error && (
                    <p>
                      Some additional item information could
                      not be loaded.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;