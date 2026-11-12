# Updating the Our Journey photo gallery

The live website is the `main` branch. Make photo changes on a separate branch and merge only after testing.

## The simple photo rule

The Our Journey album is built automatically from numbered JPG files directly inside `images/adventures/`. The number controls the order.

- **Replace a photo:** replace the original file using the same filename, for example `12.jpg`.
- **Add a photo:** add the next numbered original, for example `27.jpg`.
- **Remove a photo:** remove its numbered JPG from this folder. To keep an archive copy in the repository, move it into a subfolder such as `images/adventures/archive/`.
- **Reorder photos:** rename the numbered JPG files into the order you want, using unique numbers such as `01.jpg`, `02.jpg`, `03.jpg`.

Use JPG files with numeric names. The automation intentionally ignores other files in this folder, including the older `.jpeg` assets. Do not manually create, upload, or edit WebP files, thumbnails, or the Our Journey image list in `data/scenes.js`.

## 1. Start a new photo-update branch

1. Open GitHub Desktop and select the `our-wedding-invitation` repository.
2. Switch to `main`, click **Fetch origin**, then **Pull origin**.
3. Choose **Branch → New Branch**.
4. Name it `photo-updates/YYYY-MM-DD` (use the current date), based on `main`.

## 2. Make your photo changes

In the local project folder, open `images/adventures/` and add, replace, remove, or rename the numbered JPG files as described above.

For additions, continue the numbering sequence. Example: add `27.jpg` to add the 27th photo. You do not need to edit `data/scenes.js`; the optimizer updates that list automatically.

## 3. Push the update branch

1. Save your photo changes.
2. In GitHub Desktop, write a commit summary such as `Update Our Journey photos` and click **Commit to photo-updates/...**.
3. Click **Publish branch** or **Push origin**.

GitHub Actions automatically:
- rebuilds the Our Journey list from the numbered JPG files;
- creates full-size WebP photos and lightweight preview copies;
- removes obsolete generated numbered WebP files and previews;
- opens a pull request to `main`.

Original JPG photos are not changed by the optimizer.

## 4. Test and publish

1. Wait for the **Prepare Our Journey photo updates** workflow to finish successfully.
2. In GitHub Desktop, click **Fetch origin**, then **Pull origin** while still on your photo-update branch. This downloads the generated WebP files and updated list to your PC.
3. Test locally with `python -m http.server 8000 --bind 0.0.0.0`. On your phone, use `http://YOUR-PC-IP:8000` while connected to the same Wi-Fi.
4. Review the automatically opened pull request. Merge it into `main` only after the photos and order look correct.

The GitHub Pages deployment then publishes the approved update. Never make photo experiments directly on `main`.
