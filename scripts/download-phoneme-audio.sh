#!/bin/bash
# Download phoneme audio from IPAChart.com based on IPA mappings

set -e -o pipefail

BASE_URL="https://www.ipachart.com/mp3"
AUDIO_DIR="/Users/ryan/Developer/portuguese-pronunciation/public/audio"

# Create audio directory if it doesn't exist
mkdir -p "$AUDIO_DIR"

# Track downloads and missing files
downloaded=0
missing=0
failed=0

echo "Downloading phoneme audio files from IPAChart.com..."
echo "=========================================="

# Function to download a phoneme
download_phoneme() {
  local phoneme_id="$1"
  local descriptor="$2"

  if [ -z "$descriptor" ]; then
    echo "SKIP: $phoneme_id (no IPAChart equivalent)"
    missing=$((missing + 1))
    return
  fi

  url="${BASE_URL}/${descriptor}.mp3"
  output="${AUDIO_DIR}/${phoneme_id}.mp3"

  echo -n "Downloading $phoneme_id ... "

  if curl -f -s -o "$output" "$url"; then
    # Check if file is not empty
    if [ -s "$output" ]; then
      size=$(du -k "$output" | cut -f1)
      echo "OK (${size}KB)"
      downloaded=$((downloaded + 1))
    else
      echo "FAILED (empty file)"
      rm "$output"
      failed=$((failed + 1))
    fi
  else
    echo "FAILED (404 or network error)"
    failed=$((failed + 1))
  fi
}

# Oral vowels
download_phoneme "a-open" "Open_front_unrounded_vowel"
download_phoneme "a-central" "Near-open_central_unrounded_vowel"
download_phoneme "e-open" "Open-mid_front_unrounded_vowel"
download_phoneme "e-close" "Close-mid_front_unrounded_vowel"
download_phoneme "e-central" "Close_central_unrounded_vowel"
download_phoneme "i-close" "Close_front_unrounded_vowel"
download_phoneme "o-open" "Open-mid_back_rounded_vowel"
download_phoneme "o-close" "Close-mid_back_rounded_vowel"
download_phoneme "u-close" "Close_back_rounded_vowel"

# Nasal vowels - IPAChart doesn't have nasal vowels
download_phoneme "a-nasal" ""
download_phoneme "e-nasal" ""
download_phoneme "i-nasal" ""
download_phoneme "o-nasal" ""
download_phoneme "u-nasal" ""

# Nasal diphthongs - IPAChart doesn't have these
download_phoneme "ao-nasal" ""
download_phoneme "ae-nasal" ""
download_phoneme "oe-nasal" ""

# Semivowels (glides)
download_phoneme "j-glide" "Palatal_approximant"
download_phoneme "w-glide" "Voiced_labio-velar_approximant"

# Plosives
download_phoneme "p" "Voiceless_bilabial_plosive"
download_phoneme "b" "Voiced_bilabial_plosive"
download_phoneme "t" "Voiceless_alveolar_plosive"
download_phoneme "d" "Voiced_alveolar_plosive"
download_phoneme "k" "Voiceless_velar_plosive"
download_phoneme "g" "Voiced_velar_plosive"

# Fricatives
download_phoneme "f" "Voiceless_labiodental_fricative"
download_phoneme "v" "Voiced_labiodental_fricative"
download_phoneme "s" "Voiceless_alveolar_fricative"
download_phoneme "z" "Voiced_alveolar_fricative"
download_phoneme "sh" "Voiceless_postalveolar_fricative"
download_phoneme "zh" "Voiced_postalveolar_fricative"

# Nasals
download_phoneme "m" "Bilabial_nasal"
download_phoneme "n" "Alveolar_nasal"
download_phoneme "nh" "Palatal_nasal"

# Liquids
download_phoneme "l" "Alveolar_lateral_approximant"
download_phoneme "l-dark" ""  # Velarized l - not available on IPAChart
download_phoneme "lh" "Palatal_lateral_approximant"
download_phoneme "r-tap" "Alveolar_tap"
download_phoneme "r-uvular" "Voiced_uvular_fricative"

echo "=========================================="
echo "Summary:"
echo "  Downloaded: $downloaded"
echo "  Missing (no mapping): $missing"
echo "  Failed: $failed"
echo "  Total: $(( downloaded + missing + failed ))"
