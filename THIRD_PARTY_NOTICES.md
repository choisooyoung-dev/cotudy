# Third-party notices

cotudy 는 아래 외부 소프트웨어를 함께 쓴다. 이 부분은 cotudy 의 저작권(LICENSE)이 아니라 각자의 라이선스를 따른다.

## CheerpJ (Leaning Technologies)

- 브라우저에서 자바를 실행하는 데 쓴다. 이 저장소에 들어 있지 않고, 실행할 때 CheerpJ CDN(`cjrtnc.leaningtech.com`)에서 불러온다.
- CheerpJ Community 라이선스(개인·교육·취미 사용, 개인이 배포하는 소프트웨어)에 따라 무료로 쓰며, 화면 왼쪽 아래에 **"Built with CheerpJ"** 를 표시한다.
- https://cheerpj.com/licensing/

## Pyodide

- 브라우저에서 파이썬을 실행하는 데 쓴다. 이 저장소에 들어 있지 않고, Python 을 고르면 jsDelivr CDN(`cdn.jsdelivr.net/pyodide/v0.29.0/`)에서 불러온다.
- Mozilla Public License 2.0. https://github.com/pyodide/pyodide/blob/main/LICENSE
- Python 은 Python Software Foundation 의 상표다.

## Three.js

- 3D 화면을 그리는 데 쓴다. 빌드할 때 사이트에 함께 묶인다.
- MIT License, Copyright © 2010-2026 three.js authors. https://github.com/mrdoob/three.js/blob/dev/LICENSE

```
The MIT License

Copyright © 2010-2026 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## Java 21 런타임과 javac (CheerpJ CDN 에서 받음, 이 저장소에 넣지 않음)

- 2026-11-18 부터 자바는 CheerpJ 의 Java 21 런타임으로 돌리고, 컴파일도 그 런타임에 들어 있는 javac 로 한다. 이 파일들은 Leaning Technologies 의 CDN(`cjrtnc.leaningtech.com`)에서 브라우저가 직접 받으며, cotudy 는 다시 배포하지 않는다. 사용 조건은 위 CheerpJ 항목을 따른다.
- (그 전에는 Eclipse Temurin OpenJDK 8u512 의 `tools.jar` 를 `public/` 에 넣어 썼다. 지금은 빠졌다.)
- Java 와 OpenJDK 는 Oracle 및 그 계열사의 상표다.

## 언어 로고 (`public/icons/`)

- Java, JavaScript, Python 로고 SVG 는 [Devicon](https://github.com/devicons/devicon) v2.16.0 에서 가져왔다 (아이콘 모음은 MIT License, Copyright (c) 2015 konpa).
- 로고 자체는 각 소유자의 상표다: Java 는 Oracle 및 그 계열사, Python 은 Python Software Foundation 의 상표다. JavaScript 로고는 커뮤니티에서 만든 로고다.
- cotudy 는 어떤 언어를 고르는지 알려 주는 용도로만 쓰며, 이 회사·단체와 관계가 없고 후원·보증을 받지 않는다.

## Vite

- 개발·빌드 도구로만 쓰고, 사이트에는 포함되지 않는다. MIT License.
