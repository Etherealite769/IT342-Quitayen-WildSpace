package edu.cit.quitayen.wildspace;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Disabled("Requires Testcontainers - run manually for integration testing")
@Import(TestcontainersConfiguration.class)
@SpringBootTest
class WildspaceApplicationTests {

	@Test
	void contextLoads() {
	}

}
