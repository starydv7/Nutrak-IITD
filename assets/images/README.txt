Nutrak React Native image assets

Copy the PNG files into your project's assets/images/ directory.

Suggested use:
- nutrak-logo.png: optional logo image
- nutrak-child-header.png: decorative child illustration for the gender screen header
- boy-avatar.png and girl-avatar.png: gender selection cards
- header-background.png and question-card-bg.png: decorative backgrounds
- boy-card-bg.png and girl-card-bg.png: card background artwork
- leaf-*.png and heart.png: decorative elements
- step-active.png, step-inactive.png, step-line-*.png: progress UI artwork
- next-button.png and next-button-disabled.png: button artwork (optional; native Pressable/LinearGradient is usually better for accessibility)

Important:
The generated asset sheet is a visual concept pack. Check the images on-device and adjust crop/size as needed. The current React Native code can keep using its native shapes and gradients; use the character PNGs for the illustrated elements.
