import React, { useEffect, useState } from 'react';
import { DEFAULT_ITEM_IMAGE } from '../../constants';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

/** <img> que troca por uma imagem padrão se o link estiver vazio ou quebrado. */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = DEFAULT_ITEM_IMAGE,
  onError,
  alt,
  ...rest
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <img
      {...rest}
      alt={alt}
      src={failed || !src ? fallbackSrc : src}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
};

