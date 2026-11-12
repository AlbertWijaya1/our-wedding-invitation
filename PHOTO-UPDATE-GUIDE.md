# Updating the Our Journey photo gallery

The live website is the `main` branch. Make photo changes on a separate branch and merge only after testing.

## 1. Start a new photo-update branch

1. Open GitHub Desktop and select the `our-wedding-invitation` repository.
2. Switch to `main`, click **Fetch origin**, then **Pull origin**.
3. Choose **Branch → New Branch**.
4. Name the branch `photo-updates/YYYY-MM-DD` (use the current date), based on `main`.

## 2. Add, replace, reorder, or remove a photo

Original photos live in `images/adventures/`.

- **Replace:** replace the original file but keep its filename, for example `12.jpg`.
- **Add:** add the original photo with the next number, for example `27.jpg`.
- **Reorder:** in `data/scenes.js`, rearrange the matching `.webp` entries inside `ourJourney.images`.
- **Remove:** remove that photo's `.webp` entry from `ourJourney.images`. The optimizer removes its generated numbered WebP and thumbnail copies. The original photo file is kept as an archive unless you delete it yourself.

Use matching names for the original and WebP entry: `27.jpg` pairs with `images/adventures/27.webp`. Supported original formats are JPG, JPEG, and PNG. Do not manually create or upload `.webp` or `.thumb.webp` files; GitHub Actions creates those.

## 3. Push the update branch

1. Save your edits.
2. In GitHub Desktop, write a commit summary such as `Update Our Journey photos` and click **Commit to photo-updates/...**.
3. Click **Publish branch** or **Push origin**.

GitHub Actions automatically creates the full-size WebP images and lightweight previews, commits those generated files back to the same branch, and opens a pull request to `main`.

## 4. Test and publish

1. Wait for the **Prepare Our Journey photo updates** workflow to finish successfully.
2. In GitHub Desktop, click **Fetch origin**, then **Pull origin** while still on your photo-update branch. This downloads the generated WebP files to your PC.
3. Test locally with `python -m http.server 8000 --bind 0.0.0.0`. On your phone, use `http://YOUR-PC-IP:8000` while connected to the same Wi-Fi.
4. Review the automatically opened pull request. Merge it into `main` only after the photos and order look correct.

The GitHub Pages deployment then publishes the approved update. Never make photo experiments directly on `main`.
