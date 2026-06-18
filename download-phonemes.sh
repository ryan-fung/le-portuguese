#!/bin/bash

# Download phoneme audio files
# Usage: ./download-phonemes.sh

set -e

BASE_DIR="/Users/ryan/Developer/ipa-phoneme-library"
TEMP_FILE="/tmp/phonemes.json"

# Create base directory
mkdir -p "$BASE_DIR"

# Create subdirectories
mkdir -p "$BASE_DIR/vowel"
mkdir -p "$BASE_DIR/consonant_isolated"
mkdir -p "$BASE_DIR/consonant_before_a"

# Write JSON data
cat > "$TEMP_FILE" << 'EOF'
[
  {"ipa": "i", "url": "https://jbdowse.com/ipa/s/000.wav", "name": "Close front unrounded vowel", "category": "vowel"},
  {"ipa": "y", "url": "https://jbdowse.com/ipa/s/001.wav", "name": "Close front rounded vowel", "category": "vowel"},
  {"ipa": "ɨ", "url": "https://jbdowse.com/ipa/s/004.wav", "name": "Close central unrounded vowel", "category": "vowel"},
  {"ipa": "ʉ", "url": "https://jbdowse.com/ipa/s/005.wav", "name": "Close central rounded vowel", "category": "vowel"},
  {"ipa": "ɯ", "url": "https://jbdowse.com/ipa/s/008.wav", "name": "Close back unrounded vowel", "category": "vowel"},
  {"ipa": "u", "url": "https://jbdowse.com/ipa/s/009.wav", "name": "Close back rounded vowel", "category": "vowel"},
  {"ipa": "ɪ", "url": "https://jbdowse.com/ipa/s/010.wav", "name": "Near-close front unrounded vowel", "category": "vowel"},
  {"ipa": "ʏ", "url": "https://jbdowse.com/ipa/s/011.wav", "name": "Near-close front rounded vowel", "category": "vowel"},
  {"ipa": "ʊ", "url": "https://jbdowse.com/ipa/s/018.wav", "name": "Near-close back rounded vowel", "category": "vowel"},
  {"ipa": "e", "url": "https://jbdowse.com/ipa/s/020.wav", "name": "Close-mid front unrounded vowel", "category": "vowel"},
  {"ipa": "ø", "url": "https://jbdowse.com/ipa/s/021.wav", "name": "Close-mid front rounded vowel", "category": "vowel"},
  {"ipa": "ɘ", "url": "https://jbdowse.com/ipa/s/024.wav", "name": "Close-mid central unrounded vowel", "category": "vowel"},
  {"ipa": "ɵ", "url": "https://jbdowse.com/ipa/s/025.wav", "name": "Close-mid central rounded vowel", "category": "vowel"},
  {"ipa": "ɤ", "url": "https://jbdowse.com/ipa/s/028.wav", "name": "Close-mid back unrounded vowel", "category": "vowel"},
  {"ipa": "o", "url": "https://jbdowse.com/ipa/s/029.wav", "name": "Close-mid back rounded vowel", "category": "vowel"},
  {"ipa": "ə", "url": "https://jbdowse.com/ipa/s/034.wav", "name": "Mid central vowel", "category": "vowel"},
  {"ipa": "ɛ", "url": "https://jbdowse.com/ipa/s/040.wav", "name": "Open-mid front unrounded vowel", "category": "vowel"},
  {"ipa": "œ", "url": "https://jbdowse.com/ipa/s/041.wav", "name": "Open-mid front rounded vowel", "category": "vowel"},
  {"ipa": "ɜ", "url": "https://jbdowse.com/ipa/s/044.wav", "name": "Open-mid central unrounded vowel", "category": "vowel"},
  {"ipa": "ɞ", "url": "https://jbdowse.com/ipa/s/045.wav", "name": "Open-mid central rounded vowel", "category": "vowel"},
  {"ipa": "ʌ", "url": "https://jbdowse.com/ipa/s/048.wav", "name": "Open-mid back unrounded vowel", "category": "vowel"},
  {"ipa": "ɔ", "url": "https://jbdowse.com/ipa/s/049.wav", "name": "Open-mid back rounded vowel", "category": "vowel"},
  {"ipa": "æ", "url": "https://jbdowse.com/ipa/s/050.wav", "name": "Near-open front unrounded vowel", "category": "vowel"},
  {"ipa": "ɐ", "url": "https://jbdowse.com/ipa/s/054.wav", "name": "Near-open central vowel", "category": "vowel"},
  {"ipa": "a", "url": "https://jbdowse.com/ipa/s/060.wav", "name": "Open front unrounded vowel", "category": "vowel"},
  {"ipa": "ɶ", "url": "https://jbdowse.com/ipa/s/061.wav", "name": "Open front rounded vowel", "category": "vowel"},
  {"ipa": "ɑ", "url": "https://jbdowse.com/ipa/s/068.wav", "name": "Open back unrounded vowel", "category": "vowel"},
  {"ipa": "ɒ", "url": "https://jbdowse.com/ipa/s/069.wav", "name": "Open back rounded vowel", "category": "vowel"},
  {"ipa": "ĩ", "url": "https://jbdowse.com/ipa/s/080.wav", "name": "Close front unrounded vowel", "category": "vowel"},
  {"ipa": "ỹ", "url": "https://jbdowse.com/ipa/s/081.wav", "name": "Close front rounded vowel", "category": "vowel"},
  {"ipa": "ɨ̃", "url": "https://jbdowse.com/ipa/s/084.wav", "name": "Close central unrounded vowel", "category": "vowel"},
  {"ipa": "ʉ̃", "url": "https://jbdowse.com/ipa/s/085.wav", "name": "Close central rounded vowel", "category": "vowel"},
  {"ipa": "ɯ̃", "url": "https://jbdowse.com/ipa/s/088.wav", "name": "Close back unrounded vowel", "category": "vowel"},
  {"ipa": "ũ", "url": "https://jbdowse.com/ipa/s/089.wav", "name": "Close back rounded vowel", "category": "vowel"},
  {"ipa": "ẽ", "url": "https://jbdowse.com/ipa/s/0a0.wav", "name": "Close-mid front unrounded vowel", "category": "vowel"},
  {"ipa": "ø̃", "url": "https://jbdowse.com/ipa/s/0a1.wav", "name": "Close-mid front rounded vowel", "category": "vowel"},
  {"ipa": "ɘ̃", "url": "https://jbdowse.com/ipa/s/0a4.wav", "name": "Close-mid central unrounded vowel", "category": "vowel"},
  {"ipa": "ɵ̃", "url": "https://jbdowse.com/ipa/s/0a5.wav", "name": "Close-mid central rounded vowel", "category": "vowel"},
  {"ipa": "ɤ̃", "url": "https://jbdowse.com/ipa/s/0a8.wav", "name": "Close-mid back unrounded vowel", "category": "vowel"},
  {"ipa": "õ", "url": "https://jbdowse.com/ipa/s/0a9.wav", "name": "Close-mid back rounded vowel", "category": "vowel"},
  {"ipa": "ə̃", "url": "https://jbdowse.com/ipa/s/0b4.wav", "name": "Mid central vowel", "category": "vowel"},
  {"ipa": "ɛ̃", "url": "https://jbdowse.com/ipa/s/0c0.wav", "name": "Open-mid front unrounded vowel", "category": "vowel"},
  {"ipa": "œ̃", "url": "https://jbdowse.com/ipa/s/0c1.wav", "name": "Open-mid front rounded vowel", "category": "vowel"},
  {"ipa": "ɜ̃", "url": "https://jbdowse.com/ipa/s/0c4.wav", "name": "Open-mid central unrounded vowel", "category": "vowel"},
  {"ipa": "ɞ̃", "url": "https://jbdowse.com/ipa/s/0c5.wav", "name": "Open-mid central rounded vowel", "category": "vowel"},
  {"ipa": "ʌ̃", "url": "https://jbdowse.com/ipa/s/0c8.wav", "name": "Open-mid back unrounded vowel", "category": "vowel"},
  {"ipa": "ɔ̃", "url": "https://jbdowse.com/ipa/s/0c9.wav", "name": "Open-mid back rounded vowel", "category": "vowel"},
  {"ipa": "æ̃", "url": "https://jbdowse.com/ipa/s/0d0.wav", "name": "Near-open front unrounded vowel", "category": "vowel"},
  {"ipa": "ɐ̃", "url": "https://jbdowse.com/ipa/s/0d4.wav", "name": "Near-open central vowel", "category": "vowel"},
  {"ipa": "ã", "url": "https://jbdowse.com/ipa/s/0e0.wav", "name": "Open front unrounded vowel", "category": "vowel"},
  {"ipa": "ɶ̃", "url": "https://jbdowse.com/ipa/s/0e1.wav", "name": "Open front rounded vowel", "category": "vowel"},
  {"ipa": "ɑ̃", "url": "https://jbdowse.com/ipa/s/0e8.wav", "name": "Open back unrounded vowel", "category": "vowel"},
  {"ipa": "ɒ̃", "url": "https://jbdowse.com/ipa/s/0e9.wav", "name": "Open back rounded vowel", "category": "vowel"},
  {"ipa": "m", "url": "https://jbdowse.com/ipa/s/104.wav", "name": "Voiced bilabial nasal", "category": "consonant_isolated"},
  {"ipa": "n", "url": "https://jbdowse.com/ipa/s/144.wav", "name": "Voiced alveolar nasal", "category": "consonant_isolated"},
  {"ipa": "ɳ", "url": "https://jbdowse.com/ipa/s/164.wav", "name": "Voiced retroflex nasal", "category": "consonant_isolated"},
  {"ipa": "ɲ", "url": "https://jbdowse.com/ipa/s/174.wav", "name": "Voiced alveolo-palatal nasal", "category": "consonant_isolated"},
  {"ipa": "ŋ", "url": "https://jbdowse.com/ipa/s/184.wav", "name": "Voiced velar nasal", "category": "consonant_isolated"},
  {"ipa": "ɴ", "url": "https://jbdowse.com/ipa/s/1a4.wav", "name": "Voiced uvular nasal", "category": "consonant_isolated"},
  {"ipa": "p", "url": "https://jbdowse.com/ipa/s/201.wav", "name": "Voiceless bilabial stop", "category": "consonant_before_a"},
  {"ipa": "b", "url": "https://jbdowse.com/ipa/s/204.wav", "name": "Voiced bilabial stop", "category": "consonant_isolated"},
  {"ipa": "t", "url": "https://jbdowse.com/ipa/s/231.wav", "name": "Voiceless dental stop", "category": "consonant_before_a"},
  {"ipa": "d", "url": "https://jbdowse.com/ipa/s/244.wav", "name": "Voiced alveolar stop", "category": "consonant_isolated"},
  {"ipa": "ʈ", "url": "https://jbdowse.com/ipa/s/261.wav", "name": "Voiceless retroflex stop", "category": "consonant_before_a"},
  {"ipa": "ɖ", "url": "https://jbdowse.com/ipa/s/264.wav", "name": "Voiced retroflex stop", "category": "consonant_isolated"},
  {"ipa": "c", "url": "https://jbdowse.com/ipa/s/281.wav", "name": "Voiceless palatal stop", "category": "consonant_before_a"},
  {"ipa": "ɟ", "url": "https://jbdowse.com/ipa/s/284.wav", "name": "Voiced palatal stop", "category": "consonant_isolated"},
  {"ipa": "k", "url": "https://jbdowse.com/ipa/s/2a1.wav", "name": "Voiceless velar stop", "category": "consonant_before_a"},
  {"ipa": "ɡ", "url": "https://jbdowse.com/ipa/s/2a4.wav", "name": "Voiced velar stop", "category": "consonant_isolated"},
  {"ipa": "q", "url": "https://jbdowse.com/ipa/s/2c1.wav", "name": "Voiceless uvular stop", "category": "consonant_before_a"},
  {"ipa": "ɢ", "url": "https://jbdowse.com/ipa/s/2c4.wav", "name": "Voiced uvular stop", "category": "consonant_isolated"},
  {"ipa": "ʔ", "url": "https://jbdowse.com/ipa/s/2e4.wav", "name": "Voiced glottal stop", "category": "consonant_isolated"},
  {"ipa": "f", "url": "https://jbdowse.com/ipa/s/300.wav", "name": "Voiceless bilabial fricative", "category": "consonant_isolated"},
  {"ipa": "v", "url": "https://jbdowse.com/ipa/s/314.wav", "name": "Voiced labiodental fricative", "category": "consonant_isolated"},
  {"ipa": "θ", "url": "https://jbdowse.com/ipa/s/330.wav", "name": "Voiceless dental fricative", "category": "consonant_isolated"},
  {"ipa": "ð", "url": "https://jbdowse.com/ipa/s/334.wav", "name": "Voiced dental fricative", "category": "consonant_isolated"},
  {"ipa": "s", "url": "https://jbdowse.com/ipa/s/340.wav", "name": "Voiceless dental fricative", "category": "consonant_isolated"},
  {"ipa": "z", "url": "https://jbdowse.com/ipa/s/344.wav", "name": "Voiced alveolar fricative", "category": "consonant_isolated"},
  {"ipa": "ʃ", "url": "https://jbdowse.com/ipa/s/350.wav", "name": "Voiceless alveolar fricative", "category": "consonant_isolated"},
  {"ipa": "ʒ", "url": "https://jbdowse.com/ipa/s/354.wav", "name": "Voiced postalveolar fricative", "category": "consonant_isolated"},
  {"ipa": "ʂ", "url": "https://jbdowse.com/ipa/s/360.wav", "name": "Voiceless retroflex fricative", "category": "consonant_isolated"},
  {"ipa": "ʐ", "url": "https://jbdowse.com/ipa/s/364.wav", "name": "Voiced retroflex fricative", "category": "consonant_isolated"},
  {"ipa": "ç", "url": "https://jbdowse.com/ipa/s/380.wav", "name": "Voiceless palatal fricative", "category": "consonant_isolated"},
  {"ipa": "ʝ", "url": "https://jbdowse.com/ipa/s/384.wav", "name": "Voiced palatal fricative", "category": "consonant_isolated"},
  {"ipa": "x", "url": "https://jbdowse.com/ipa/s/3a0.wav", "name": "Voiceless velar fricative", "category": "consonant_isolated"},
  {"ipa": "ɣ", "url": "https://jbdowse.com/ipa/s/3a4.wav", "name": "Voiced velar fricative", "category": "consonant_isolated"},
  {"ipa": "χ", "url": "https://jbdowse.com/ipa/s/3c0.wav", "name": "Voiceless uvular fricative", "category": "consonant_isolated"},
  {"ipa": "ʁ", "url": "https://jbdowse.com/ipa/s/3c4.wav", "name": "Voiced uvular fricative", "category": "consonant_isolated"},
  {"ipa": "ħ", "url": "https://jbdowse.com/ipa/s/3e0.wav", "name": "Voiceless pharyngeal fricative", "category": "consonant_isolated"},
  {"ipa": "ʕ", "url": "https://jbdowse.com/ipa/s/3e4.wav", "name": "Voiced pharyngeal fricative", "category": "consonant_isolated"},
  {"ipa": "h", "url": "https://jbdowse.com/ipa/s/3f0.wav", "name": "Voiceless glottal fricative", "category": "consonant_isolated"},
  {"ipa": "ɦ", "url": "https://jbdowse.com/ipa/s/3f4.wav", "name": "Voiced glottal fricative", "category": "consonant_isolated"},
  {"ipa": "ʋ", "url": "https://jbdowse.com/ipa/s/414.wav", "name": "Voiced labiodental approximant", "category": "consonant_isolated"},
  {"ipa": "ɹ", "url": "https://jbdowse.com/ipa/s/444.wav", "name": "Voiced alveolar approximant", "category": "consonant_isolated"},
  {"ipa": "ɻ", "url": "https://jbdowse.com/ipa/s/464.wav", "name": "Voiced retroflex approximant", "category": "consonant_isolated"},
  {"ipa": "j", "url": "https://jbdowse.com/ipa/s/484.wav", "name": "Voiced palatal approximant", "category": "consonant_isolated"},
  {"ipa": "ɰ", "url": "https://jbdowse.com/ipa/s/4a4.wav", "name": "Voiced velar approximant", "category": "consonant_isolated"},
  {"ipa": "ʙ", "url": "https://jbdowse.com/ipa/s/504.wav", "name": "Voiced bilabial trill", "category": "consonant_isolated"},
  {"ipa": "r", "url": "https://jbdowse.com/ipa/s/544.wav", "name": "Voiced alveolar trill", "category": "consonant_isolated"},
  {"ipa": "ʀ", "url": "https://jbdowse.com/ipa/s/5c4.wav", "name": "Voiced uvular trill", "category": "consonant_isolated"},
  {"ipa": "ⱱ", "url": "https://jbdowse.com/ipa/s/614.wav", "name": "Voiced labiodental tap/flap", "category": "consonant_isolated"},
  {"ipa": "ɾ", "url": "https://jbdowse.com/ipa/s/644.wav", "name": "Voiced alveolar tap/flap", "category": "consonant_isolated"},
  {"ipa": "ɽ", "url": "https://jbdowse.com/ipa/s/664.wav", "name": "Voiced retroflex tap/flap", "category": "consonant_isolated"},
  {"ipa": "l", "url": "https://jbdowse.com/ipa/s/744.wav", "name": "Voiced alveolar lat. approximant", "category": "consonant_isolated"},
  {"ipa": "ɭ", "url": "https://jbdowse.com/ipa/s/764.wav", "name": "Voiced retroflex lat. approximant", "category": "consonant_isolated"},
  {"ipa": "ʎ", "url": "https://jbdowse.com/ipa/s/774.wav", "name": "Voiced palatal lat. approximant", "category": "consonant_isolated"},
  {"ipa": "ʟ", "url": "https://jbdowse.com/ipa/s/7a4.wav", "name": "Voiced velar lat. approximant", "category": "consonant_isolated"}
]
EOF

echo "Starting download of 107 phoneme files..."
echo ""

# Counters
total=0
downloaded=0
failed=0
progress_interval=20

# Download function
download_phoneme() {
  local url="$1"
  local category="$2"
  local name="$3"
  local ipa="$4"

  # Convert name to filename format (replace spaces with underscores)
  local filename=$(echo "$name" | tr ' ' '_' | tr -d '/')
  filename="${filename}-${ipa}.wav"

  local output_path="$BASE_DIR/$category/$filename"

  # Try downloading with retry
  if curl -s -f -o "$output_path" "$url" 2>/dev/null; then
    return 0
  else
    sleep 0.5
    if curl -s -f -o "$output_path" "$url" 2>/dev/null; then
      return 0
    else
      return 1
    fi
  fi
}

# Export function for parallel execution
export -f download_phoneme
export BASE_DIR

# Process each phoneme
while IFS= read -r line; do
  total=$((total + 1))

  # Parse JSON (basic extraction)
  ipa=$(echo "$line" | grep -o '"ipa": *"[^"]*"' | sed 's/"ipa": *"\([^"]*\)"/\1/')
  url=$(echo "$line" | grep -o '"url": *"[^"]*"' | sed 's/"url": *"\([^"]*\)"/\1/')
  name=$(echo "$line" | grep -o '"name": *"[^"]*"' | sed 's/"name": *"\([^"]*\)"/\1/')
  category=$(echo "$line" | grep -o '"category": *"[^"]*"' | sed 's/"category": *"\([^"]*\)"/\1/')

  if [ -n "$url" ] && [ -n "$ipa" ]; then
    if download_phoneme "$url" "$category" "$name" "$ipa"; then
      downloaded=$((downloaded + 1))
      echo "[$downloaded/$total] Downloaded: $name ($ipa)"
    else
      failed=$((failed + 1))
      echo "[$total] FAILED: $name ($ipa) - $url" | tee -a "$BASE_DIR/failed.log"
    fi

    # Progress report every 20 files
    if [ $((total % progress_interval)) -eq 0 ]; then
      echo ""
      echo "=== Progress: $total files processed, $downloaded downloaded, $failed failed ==="
      echo ""
    fi
  fi
done < <(grep -o '{[^}]*}' "$TEMP_FILE")

# Calculate total size
total_size=$(du -sh "$BASE_DIR" | awk '{print $1}')

# Final report
echo ""
echo "======================================"
echo "Download Complete!"
echo "======================================"
echo "Total files processed: $total"
echo "Successfully downloaded: $downloaded"
echo "Failed downloads: $failed"
echo "Total size: $total_size"
echo "Library location: $BASE_DIR"
echo ""

if [ $failed -gt 0 ]; then
  echo "Failed downloads logged to: $BASE_DIR/failed.log"
fi

# Cleanup
rm -f "$TEMP_FILE"
