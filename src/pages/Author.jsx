import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorImage from "../images/author_thumbnail.jpg";
import AuthorItems from "../components/author/AuthorItems";

const readResult = (result) => {
  if (
    result.status === "fulfilled" &&
    Array.isArray(result.value.data)
  ) {
    return result.value.data;
  }

  return [];
};

const matchesAuthor = (entry, key) => {
  const values = [
    entry.authorId,
    entry.id,
    entry.authorName,
    entry.name,
  ];

  return values.some(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value) === String(key)
  );
};

const Author = () => {
  const { authorId } = useParams();
  const location = useLocation();

  const [author, setAuthor] = useState(
    location.state?.author || null
  );
  const [authorItems, setAuthorItems] = useState([]);
  const [loading, setLoading] = useState(
    !location.state?.author
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    let active = true;

    async function fetchAuthor() {
      setLoading(true);
      setError(false);

      try {
        const results = await Promise.allSettled([
          axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
          ),
          axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
          ),
          axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
          ),
          axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
          ),
        ]);

        const sellers = readResult(results[0]);
        const newItems = readResult(results[1]);
        const exploreItems = readResult(results[2]);
        const collections = readResult(results[3]);

        const allItems = [
          ...newItems,
          ...exploreItems,
          ...collections,
        ];

        const requestedKey = authorId
          ? decodeURIComponent(authorId)
          : null;

        const stateAuthor = location.state?.author || {};

        const matchedAuthor =
          sellers.find((seller) =>
            matchesAuthor(seller, requestedKey)
          ) ||
          allItems.find((item) =>
            matchesAuthor(item, requestedKey)
          ) ||
          null;

        const mergedAuthor = {
          ...(matchedAuthor || {}),
          ...stateAuthor,
        };

        const resolvedName =
          mergedAuthor.authorName ||
          mergedAuthor.name ||
          (!requestedKey || /^\d+$/.test(requestedKey)
            ? ""
            : requestedKey);

        const resolvedId =
          mergedAuthor.authorId ??
          mergedAuthor.id ??
          requestedKey;

        const relatedItems = allItems.filter((item) => {
          const idMatch =
            resolvedId !== undefined &&
            resolvedId !== null &&
            String(item.authorId) === String(resolvedId);

          const nameMatch =
            resolvedName &&
            item.authorName === resolvedName;

          return idMatch || nameMatch;
        });

        const uniqueItems = Array.from(
          new Map(
            relatedItems.map((item) => [
              String(item.nftId ?? item.id),
              item,
            ])
          ).values()
        );

        if (!active) {
          return;
        }

        setAuthor({
          ...mergedAuthor,
          authorId: resolvedId,
          authorName:
            resolvedName ||
            `Author ${resolvedId || ""}`.trim(),
        });

        setAuthorItems(uniqueItems);
      } catch {
        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchAuthor();

    return () => {
      active = false;
    };
  }, [authorId]);

  const copyWallet = () => {
    const value =
      author?.walletAddress ||
      author?.authorId ||
      author?.id;

    if (value && navigator.clipboard) {
      navigator.clipboard.writeText(String(value));
    }
  };

  const authorName =
    author?.authorName ||
    author?.name ||
    "Unknown Author";

  const authorImage =
    author?.authorImage ||
    author?.ownerImage ||
    AuthorImage;

  const username =
    author?.tag ||
    author?.username ||
    `@${authorName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")}`;

  const wallet =
    author?.walletAddress ||
    author?.authorId ||
    author?.id ||
    "";

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{
            background: `url(${AuthorBanner}) top`,
          }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      {loading && !author ? (
                        <div
                          style={{
                            width: 150,
                            height: 150,
                            borderRadius: "50%",
                            background: "#eeeeee",
                          }}
                        ></div>
                      ) : (
                        <img
                          src={authorImage}
                          alt={authorName}
                        />
                      )}

                      <i className="fa fa-check"></i>

                      <div className="profile_name">
                        <h4>
                          {authorName}

                          <span className="profile_username">
                            {username}
                          </span>

                          {wallet && (
                            <>
                              <span
                                id="wallet"
                                className="profile_wallet"
                              >
                                {wallet}
                              </span>

                              <button
                                id="btn_copy"
                                title="Copy Text"
                                onClick={copyWallet}
                              >
                                Copy
                              </button>
                            </>
                          )}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      {author?.followers !== undefined &&
                        author?.followers !== null && (
                          <div className="profile_follower">
                            {author.followers} followers
                          </div>
                        )}

                      <Link to="#" className="btn-main">
                        Follow
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems items={authorItems} />
                </div>
              </div>

              {error && (
                <div className="col-12 text-center">
                  <p>
                    Some author information could not be
                    loaded.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;