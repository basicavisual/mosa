# Collection images

Put publishable image files in this directory, grouped into subdirectories when
useful. Reference each file from the `images` array of the source JSON record
that documents it. Paths are relative to this directory.

Git LFS stores the binary files. A normal Git LFS checkout restores them before
the website build, and the website optimises them into its Docker image.

Only add images that MoSA is authorised to publish. Record available credit,
rights and original URL information in the source record rather than in the
filename.
