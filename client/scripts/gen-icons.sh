#!/usr/bin/env bash
# Genera iconos PWA usando ImageMagick (convert) o fallback a node
# Instalar ImageMagick: brew install imagemagick

MAGENTA="#F5A623"
DARK="#0B0B0F"

create_icon() {
  local size=$1
  local output=$2
  local maskable=$3

  convert -size "${size}x${size}" xc:"$DARK" \
    -fill none -stroke "$MAGENTA" -strokewidth $((size / 40 + 1)) \
    -draw "roundrectangle $((size/10)),$((size/10)) $((size*9/10)),$((size*9/10)) $((size/5)),$((size/5))" \
    -fill "$MAGENTA" \
    -font Helvetica-Bold -pointsize $((size / 3)) -gravity center \
    -annotate 0 "V6" \
    "$output"
}

echo "Generando iconos PWA..."
create_icon 192 "public/icon-192.png"
create_icon 512 "public/icon-512.png"

# Maskable: rellena toda el área
convert -size 512x512 xc:"$DARK" \
  -fill "$MAGENTA" \
  -font Helvetica-Bold -pointsize 170 -gravity center \
  -annotate 0 "V6" \
  "public/icon-512-maskable.png"

# Apple touch icon
cp "public/icon-512.png" "public/apple-touch-icon.png"

echo "Iconos generados."
