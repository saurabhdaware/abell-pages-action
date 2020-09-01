# Abell Pages GitHub Action

EXPERIMENTAL!

Deploy a documentation site for your repository.

## Installation

In `.github/workflows/abell-deploy.yml`, Add this content.
```yaml
on:
  push:
    branches: [master]

jobs:
  abell-deploy:
    runs-on: ubuntu-latest
    name: Abell Website Deployment
    steps:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Abell Pages Action
      id: abell-pages
      uses: saurabhdaware/abell-pages-action@master
      with:
        site-path: 'https://github.com/saurabhdaware/abell-readme-layout'
        deploy-branch: 'master' # branch to deploy from, should be same as on push branch
```

## Deployment

### Deploying to GitHub Pages

In Repository Settings -> GitHub Pages, set source branch to `gh-pages` and directory to `/docs`.


### Deploying to Netlify/Other Platforms

Set publish branch to `gh-pages` and publish directory to `/docs`


## Detailed Usage
### Inputs

#### `site-path`

**Required** Path of the site layout, or layout repository.

GitHub Repository URL | path to folder.

---

Thanks!