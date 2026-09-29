from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
MOBILE = ROOT

REQUIRED_JS = (
    "main.js",
    "config.js",
    "stoneminer.js",
    "lib/vision.js",
    "lib/input.js",
)

REQUIRED_ASSETS = (
    "coinoff.png",
    "challenge.png",
    "selected.png",
    "enter_solo2.png",
    "dungeon-complete.png",
    "skip.png",
    "again.png",
    "keep.png",
    "menu.png",
)


def test_mobile_port_has_required_scripts_and_assets():
    for relative in REQUIRED_JS:
        path = MOBILE / relative
        assert path.is_file(), relative
        assert path.stat().st_size > 0, relative

    for filename in REQUIRED_ASSETS:
        path = MOBILE / "assets" / filename
        assert path.is_file(), filename
        assert path.read_bytes().startswith(b"\x89PNG\r\n\x1a\n"), filename


def test_mobile_javascript_parses_when_node_is_available():
    node = shutil.which("node")
    if node is None:
        return

    for relative in REQUIRED_JS:
        result = subprocess.run(
            [node, "--check", str(MOBILE / relative)],
            capture_output=True,
            text=True,
            check=False,
        )
        assert result.returncode == 0, result.stderr
