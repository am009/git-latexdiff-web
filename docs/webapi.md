# Web API Specification

### Endpoint /diff

**Request**

- Format: form data
- Fields:
  - `old_zip` (File): old project zip file
  - `new_zip` (File): new project zip file
  - `config` (json string): config.json content
  - `download_diff_proj` (string): whether or not return the diff project zip file
    - must be one of "true" or "false".

**Response**

- Format: json
- Fields:
  - `diff_pdf` (base64 string): base64 encoded diff.pdf file.
  - `diff_proj` (base64 string): base64 encoded diff project file.
  - `docker_output` (string): docker run output.
