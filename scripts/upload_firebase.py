"""
Upload file to Firebase Storage (Google Cloud Storage)
Usage: python upload_firebase.py --bucket <bucket> --file <path> --dest <destination> --credentials <json-path>
"""

import argparse
import sys
from pathlib import Path

from google.cloud import storage


def upload_file_to_storage(
    bucket_name: str,
    source_file: Path,
    destination_blob: str,
    credentials_path: Path,
    make_public: bool = True,
    cache_control: str | None = None,
) -> str:
    """Upload a file to Firebase Storage (GCS)
    
    Args:
        bucket_name: Name of the storage bucket
        source_file: Local file path to upload
        destination_blob: Destination path in bucket
        credentials_path: Path to service account JSON
        make_public: Whether to make the uploaded file public
        
    Returns:
        Public URL of the uploaded file
    """
    if not source_file.exists():
        raise FileNotFoundError(f"Source file not found: {source_file}")
    
    if not credentials_path.exists():
        raise FileNotFoundError(f"Credentials file not found: {credentials_path}")
    
    print(f"Initializing Firebase Storage client...")
    client = storage.Client.from_service_account_json(str(credentials_path))
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(destination_blob)
    
    print(f"Uploading {source_file.name} ({source_file.stat().st_size / (1024*1024):.2f} MB)...")
    if cache_control:
        blob.cache_control = cache_control
    blob.upload_from_filename(str(source_file))
    if cache_control:
        try:
            blob.patch()
        except Exception:
            # Non-fatal: patch may fail if permissions restrict metadata changes
            print(f"[WARNING] Could not set Cache-Control metadata on {destination_blob}")
    
    if make_public:
        try:
            print(f"Making file public...")
            blob.make_public()
        except Exception as e:
            print(f"[WARNING] Could not make file public (bucket may have uniform access enabled): {e}")
            print(f"File is accessible via direct URL or public link sharing can be configured separately.")
    
    public_url = blob.public_url
    print(f"[SUCCESS] Upload successful!")
    print(f"  Storage path: gs://{bucket_name}/{destination_blob}")
    print(f"  Public URL: {public_url}")
    
    return public_url


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Upload file to Firebase Storage",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--bucket",
        required=True,
        help="Firebase Storage bucket name (e.g., myproject.appspot.com)",
    )
    parser.add_argument(
        "--file",
        required=True,
        help="Local file path to upload",
    )
    parser.add_argument(
        "--dest",
        required=True,
        help="Destination path in bucket (e.g., installers/v1.0.0/app.exe)",
    )
    parser.add_argument(
        "--credentials",
        required=True,
        help="Path to Firebase service account JSON key",
    )
    parser.add_argument(
        "--cache-control",
        required=False,
        help="Optional Cache-Control header value to set on the uploaded object",
    )
    parser.add_argument(
        "--private",
        action="store_true",
        help="Keep file private (default: make public)",
    )
    
    args = parser.parse_args()
    
    try:
        upload_file_to_storage(
            bucket_name=args.bucket,
            source_file=Path(args.file),
            destination_blob=args.dest,
            credentials_path=Path(args.credentials),
            make_public=not args.private,
            cache_control=args.cache_control,
        )
        return 0
    except FileNotFoundError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"ERROR: Upload failed: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
