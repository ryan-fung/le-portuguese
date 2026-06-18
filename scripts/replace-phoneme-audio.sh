#!/bin/bash
set -e

# Replace ALL Lê phoneme audio files with high-quality jbdowse recordings
# Maps Lê's 39 phonemes to the jbdowse IPA library

JBDOWSE_LIB="/Users/ryan/Developer/ipa-phoneme-library"
LE_AUDIO="/Users/ryan/Developer/portuguese-pronunciation/public/audio"

echo "🔄 Replacing Lê phoneme audio with jbdowse HQ recordings..."
echo ""

# Function to copy and convert WAV to MP3
copy_phoneme() {
  local jbdowse_file="$1"
  local le_filename="$2"

  if [ ! -f "$jbdowse_file" ]; then
    echo "❌ MISSING: $jbdowse_file for $le_filename"
    return 1
  fi

  # Convert WAV to MP3 with ffmpeg (or just copy if MP3)
  if command -v ffmpeg &> /dev/null; then
    ffmpeg -i "$jbdowse_file" -codec:a libmp3lame -qscale:a 2 "$LE_AUDIO/$le_filename" -y &> /dev/null
    echo "✓ $le_filename ($(du -h "$LE_AUDIO/$le_filename" | cut -f1))"
  else
    # Fallback: just copy as WAV renamed to .mp3
    cp "$jbdowse_file" "$LE_AUDIO/$le_filename"
    echo "✓ $le_filename (copied WAV as MP3 - install ffmpeg for proper conversion)"
  fi
}

echo "📂 Oral Vowels (9)"
copy_phoneme "$JBDOWSE_LIB/vowels/oral/060_a_isolated.wav" "a-open.mp3"
copy_phoneme "$JBDOWSE_LIB/vowels/oral/054_ɐ_isolated.wav" "a-central.mp3"
copy_phoneme "$JBDOWSE_LIB/vowels/oral/040_ɛ_isolated.wav" "e-open.mp3"
copy_phoneme "$JBDOWSE_LIB/vowels/oral/020_e_isolated.wav" "e-close.mp3"
copy_phoneme "$JBDOWSE_LIB/vowels/oral/004_ɨ_isolated.wav" "e-central.mp3"
copy_phoneme "$JBDOWSE_LIB/vowels/oral/000_i_isolated.wav" "i-close.mp3"
copy_phoneme "$JBDOWSE_LIB/vowels/oral/049_ɔ_isolated.wav" "o-open.mp3"
copy_phoneme "$JBDOWSE_LIB/vowels/oral/029_o_isolated.wav" "o-close.mp3"
copy_phoneme "$JBDOWSE_LIB/vowels/oral/009_u_isolated.wav" "u-close.mp3"

echo ""
echo "📂 Nasal Vowels (5)"
copy_phoneme "$JBDOWSE_LIB/vowels/nasal/0c4_ɐ̃_isolated.wav" "a-nasal.mp3"
copy_phoneme "$JBDOWSE_LIB/vowels/nasal/090_ẽ_isolated.wav" "e-nasal.mp3"
copy_phoneme "$JBDOWSE_LIB/vowels/nasal/070_ĩ_isolated.wav" "i-nasal.mp3"
copy_phoneme "$JBDOWSE_LIB/vowels/nasal/099_õ_isolated.wav" "o-nasal.mp3"
copy_phoneme "$JBDOWSE_LIB/vowels/nasal/079_ũ_isolated.wav" "u-nasal.mp3"

echo ""
echo "📂 Nasal Diphthongs (3)"
# These might not exist as single phonemes - may need to synthesize or use approximations
if [ -f "$JBDOWSE_LIB/vowels/nasal/0c4_ɐ̃_isolated.wav" ]; then
  # Use ɐ̃w̃ approximation for now - ideally would be a diphthong
  copy_phoneme "$JBDOWSE_LIB/vowels/nasal/0c4_ɐ̃_isolated.wav" "ao-nasal.mp3"
  copy_phoneme "$JBDOWSE_LIB/vowels/nasal/0c4_ɐ̃_isolated.wav" "ae-nasal.mp3"
  copy_phoneme "$JBDOWSE_LIB/vowels/nasal/099_õ_isolated.wav" "oe-nasal.mp3"
fi

echo ""
echo "📂 Glides (2)"
copy_phoneme "$JBDOWSE_LIB/consonants/684_j_isolated.wav" "j-glide.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/6a4_w_isolated.wav" "w-glide.mp3"

echo ""
echo "📂 Plosives (6)"
copy_phoneme "$JBDOWSE_LIB/consonants/201_p_isolated.wav" "p.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/204_b_isolated.wav" "b.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/241_t_isolated.wav" "t.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/244_d_isolated.wav" "d.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/291_k_isolated.wav" "k.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/294_g_isolated.wav" "g.mp3"

echo ""
echo "📂 Fricatives (6)"
copy_phoneme "$JBDOWSE_LIB/consonants/510_f_isolated.wav" "f.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/514_v_isolated.wav" "v.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/540_s_isolated.wav" "s.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/544_z_isolated.wav" "z.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/550_ʃ_isolated.wav" "sh.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/554_ʒ_isolated.wav" "zh.mp3"

echo ""
echo "📂 Nasals (3)"
copy_phoneme "$JBDOWSE_LIB/consonants/104_m_isolated.wav" "m.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/144_n_isolated.wav" "n.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/184_ɲ_isolated.wav" "nh.mp3"

echo ""
echo "📂 Liquids (4)"
copy_phoneme "$JBDOWSE_LIB/consonants/744_l_isolated.wav" "l.mp3"
# l-dark (ɫ) might not exist - use regular l as fallback
if [ -f "$JBDOWSE_LIB/consonants/744_l_isolated.wav" ]; then
  copy_phoneme "$JBDOWSE_LIB/consonants/744_l_isolated.wav" "l-dark.mp3"
fi
copy_phoneme "$JBDOWSE_LIB/consonants/784_ʎ_isolated.wav" "lh.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/844_ɾ_isolated.wav" "r-tap.mp3"
copy_phoneme "$JBDOWSE_LIB/consonants/5b4_ʁ_isolated.wav" "r-uvular.mp3"

echo ""
echo "✅ Done! All 39 phoneme audio files replaced."
echo ""
echo "📊 Verifying file sizes..."
du -sh "$LE_AUDIO"/*.mp3 | wc -l
echo "files found in $LE_AUDIO"
