package edu.cit.quitayen.wildspace;

import org.springframework.boot.SpringApplication;

public class TestWildspaceApplication {

	public static void main(String[] args) {
		SpringApplication.from(WildspaceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
