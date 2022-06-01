<?php

require_once __DIR__ . '/wfFileUtils.php';
require_once __DIR__ . '/wfScanFile.php';

class wfScanPath {

	private $baseDirectory;
	private $path;
	private $realPath;
	private $wordpressPath;
	private $expectedFiles;

	public function __construct($baseDirectory, $path, $wordpressPath = null, $expectedFiles = null) {
		$this->baseDirectory = $baseDirectory;
		$this->path = $path;
		$this->realPath = realpath($path);
		$this->wordpressPath = $wordpressPath;
		$this->expectedFiles = is_array($expectedFiles) ? array_flip($expectedFiles) : null;
	}

	public function getPath() {
		return $this->path;
	}

	public function getRealPath() {
		return $this->realPath;
	}

	public function getWordpressPath() {
		return $this->wordpressPath;
	}

	public function hasExpectedFiles() {
		return $this->expectedFiles !== null && !empty($this->expectedFiles);
	}

	public function expectsFile($name) {
		return array_key_exists($name, $this->expectedFiles);
	}

	public function isBaseDirectory() {
		return $this->path === $this->baseDirectory;
	}

	public function isBelowBaseDirectory() {
		return wfFileUtils::belongsTo($this->path, $this->baseDirectory);
	}

	public function getContents() {
		return wfFileUtils::getContents($this->realPath);
	}

	public function createScanFile($relativePath) {
		return new wfScanFile(
			realpath(wfFileUtils::joinPaths($this->realPath, $relativePath)),
			wfFileUtils::trimSeparators(wfFileUtils::joinPaths($this->wordpressPath, $relativePath), true, false)
		);
	}

	public function __toString() {
		return $this->realPath;
	}

}