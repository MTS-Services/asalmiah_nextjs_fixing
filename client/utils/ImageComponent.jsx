import React, { useState } from "react";
import {
  ShimmerCircularImage,
  ShimmerContentBlock,
  ShimmerThumbnail,
} from "react-shimmer-effects";
const ImageComponent = ({
  data,
  functionData,
  className,
  staticData,
  width,
  alt,
  height,
  designImage,
  dynamicLabellingState,
  shimmerHeight,
  ShimmerClassName,
  content,
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {!designImage && !dynamicLabellingState && loading && !content && (
        <div className="shimmer" />
      )}
      {designImage && loading && !content && (
        <ShimmerCircularImage width={147} height={147} size={147} />
      )}
      {dynamicLabellingState && loading && !content && (
        <ShimmerThumbnail
          height={shimmerHeight}
          rounded
          className={ShimmerClassName ?? ""}
        />
      )}
      {!content ? (
        <img
          src={
            data ? data : staticData ? staticData : "/images/static_image.jpg"
          }
          width={width}
          height={height}
          alt={alt ?? "image"}
          className={className ?? ""}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          style={{ display: loading ? "none" : "block" }}
        />
      ) : (
        ""
      )}

      {content ? (
        <ShimmerContentBlock title thumbnailWidth={7} thumbnailHeight={7} />
      ) : (
        ""
      )}
    </>
  );
};

export default ImageComponent;
