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

## javac (`public/tools.jar`) — Eclipse Temurin OpenJDK 8u512-b09

- 브라우저 안에서 자바 코드를 컴파일하는 데 쓴다. [Eclipse Temurin](https://adoptium.net/) JDK 8u512-b09 의 `lib/tools.jar` 를 그대로 넣었다.
- 라이선스: **GNU General Public License v2 + Classpath Exception** (OpenJDK). cotudy 의 LICENSE 는 이 파일에 적용되지 않는다.
- 라이선스 전문은 사이트와 저장소에 함께 둔다: [`public/licenses/openjdk/LICENSE`](public/licenses/openjdk/LICENSE), [`ASSEMBLY_EXCEPTION`](public/licenses/openjdk/ASSEMBLY_EXCEPTION), [`THIRD_PARTY_README`](public/licenses/openjdk/THIRD_PARTY_README)
- 소스 코드: https://github.com/adoptium/jdk8u (태그 `jdk8u512-b09`)
- Java 와 OpenJDK 는 Oracle 및 그 계열사의 상표다.

## Vite

- 개발·빌드 도구로만 쓰고, 사이트에는 포함되지 않는다. MIT License.
